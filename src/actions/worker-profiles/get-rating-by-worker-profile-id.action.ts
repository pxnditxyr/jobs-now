import { defineAction } from 'astro:actions'
import { and, CommentService, db, eq, Service, WorkerProfile, } from 'astro:db'

export const getRatingByWorkerProfileId = defineAction({
  accept: 'json',
  handler: async ({ workerProfileId }) => {
    const [ data ] = await db
      .select()
      .from( WorkerProfile )
      .where( eq( WorkerProfile.id, workerProfileId ) )

    if ( !data )
      throw new Error( 'No se encontró el perfil del trabajador. 🤵‍♂️' )

    const publications = await db
      .select()
      .from( Service )
      .innerJoin( CommentService, eq( Service.id, CommentService.serviceId ) )
      .where(
        and(
          eq( Service.workerId, workerProfileId ),
          eq( Service.status, true ),
          eq( CommentService.status, true ),
        )
      )

    if ( publications.length === 0 ) {
      return {
        rating: 0
      }
    }

    const ratingSum = publications.reduce( ( total, publication ) => {
      return total + publication.CommentService.rating
    }, 0 )

    const ratingAverage = ratingSum / publications.length

    return {
      rating: ratingAverage,
    }
  }
})
