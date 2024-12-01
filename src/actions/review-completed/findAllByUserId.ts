import { defineAction } from 'astro:actions'
import { and, db, desc, eq, ReviewCompletedWork, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'

export const findAllPendingRatingByUserId = defineAction({
  accept: 'json',
  input: z.object({
    userId: z.string({ message: 'El id del usuario es obligatorio.' }),
  }),
  handler: async ({ userId }) => {
    const data = await db
      .select()
      .from( ReviewCompletedWork )
      .innerJoin( WorkerProfile, eq( ReviewCompletedWork.workerProfileId, WorkerProfile.id ) )
      .where(
        and(
          eq(
            ReviewCompletedWork.userId, userId
          ),
          eq(
            ReviewCompletedWork.state, 'pending'
          )
        )
      )
      .orderBy(
        desc(
          ReviewCompletedWork.createdAt
        )
      )
    return {
      pendingRatings: data.map( ( { ReviewCompletedWork, WorkerProfile } ) => ({
        ...ReviewCompletedWork,
        workerProfile: WorkerProfile
      }) ).reverse()
    }
  }
})
