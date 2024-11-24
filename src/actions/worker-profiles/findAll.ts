import { defineAction } from 'astro:actions'
import { and, CommentService, db, desc, eq, like, or, ReviewWorker, Service, ServiceCategory, User, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'

export const findAllWorkerProfiles = defineAction({
  accept: 'json',
  input: z.object({
    search: z.string().optional(),
    rating: z.number().optional(),
    serviceCategoryId: z.string().optional(),
  }),
  handler: async ({ search, rating, serviceCategoryId }) => {
    let searchQuery = search ?? ''
    searchQuery = '%' + searchQuery + '%'

    const workerProfiles = await db
      .select()
      .from( WorkerProfile )
      .innerJoin( User, eq( User.id, WorkerProfile.userId ) )
      .where(
        or(
          like( User.name, searchQuery ),
          like( User.lastName, searchQuery ),
        ),
      )
      .orderBy(
        desc(
          WorkerProfile.createdAt
        )
       )

    let workerProfilesFiltered = await Promise.all(workerProfiles.map(async ({ WorkerProfile, User }) => {

      const publications = await db
        .select()
        .from(Service)
        .innerJoin(CommentService, eq(Service.id, CommentService.serviceId))
        .innerJoin(ServiceCategory, eq(Service.categoryId, ServiceCategory.id))
        .where(
          and(
            eq(Service.workerId, WorkerProfile.id),
            eq(Service.status, true),
            eq(CommentService.status, true),
          )
        )
        .orderBy(
          desc(
            Service.createdAt
          )
        )

      let ratingAverage = 0
      let noRepeatedServiceCategoryIds : any = []

      if (publications.length > 0) {
        const ratingSum = publications.reduce((total, publication) => {
          return total + publication.CommentService.rating
        }, 0)

        ratingAverage = ratingSum / publications.length

        const serviceCategoryIds = publications.map(ps => ps.ServiceCategory.id)
        noRepeatedServiceCategoryIds = Array.from(new Set(serviceCategoryIds))
      }

      return {
        ...WorkerProfile,
        user: User,
        rating: ratingAverage,
        serviceCategories: noRepeatedServiceCategoryIds
      }
    }))

    if ( rating !== undefined && rating !== 0 ) {
      workerProfilesFiltered = workerProfilesFiltered.filter(wp => wp.rating >= rating)
    }

    if ( serviceCategoryId !== undefined && serviceCategoryId !== '' ) {
      workerProfilesFiltered = workerProfilesFiltered.filter(wp => wp.serviceCategories.includes(serviceCategoryId))
    }

    return {
      workerProfiles: workerProfilesFiltered
    }
  }
})
