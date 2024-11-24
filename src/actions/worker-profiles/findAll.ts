import { defineAction } from 'astro:actions'
import { db, desc, eq, like, or, ReviewWorker, User, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'

export const findAllWorkerProfiles = defineAction({
  accept: 'json',
  input: z.object({
    search: z.string().optional(),
    calificacion: z.string().optional(),
    serviceCategoryId: z.string().optional(),
  }),
  handler: async ({ search, calificacion, serviceCategoryId }) => {

    const data = await db
      .select()
      .from( WorkerProfile )
      .innerJoin( User, eq( User.id, WorkerProfile.userId ) )
      .where(
        or(
          or(
            like( User.name, search ?? '%%' ),
            like( User.lastName, search ?? '%%' ),
            like( WorkerProfile.description, search ?? '%%' ),
            like( WorkerProfile.experience, search ?? '%%' ),
            like( WorkerProfile.skills, search ?? '%%' ),
          ),
        ),
      )
      .orderBy(
        desc(
          WorkerProfile.createdAt
        )
       )



    return {
      workerProfiles: data.map( ( { WorkerProfile, User } ) => ( {
        ...WorkerProfile,
        user: User
      } ) )
    }
  }
})
