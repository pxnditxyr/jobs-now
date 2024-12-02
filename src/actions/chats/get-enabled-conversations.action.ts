import { defineAction } from 'astro:actions'
import { and, db, eq, HiringWorker, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'

export const getEnabledConversationsByUserId = defineAction({
  accept: 'json',
  input: z.object({
    userId: z.string({ required_error: 'El ID del usuario es requerido.' }),
  }),
  handler: async ({ userId }) => {
    try {
      const userHirings = await db.select()
        .from( HiringWorker )
        .innerJoin( WorkerProfile, eq( HiringWorker.workerProfileId, WorkerProfile.id ) )
        .where(
          and(
            eq( HiringWorker.userId, userId ),
            eq( HiringWorker.state, 'approved' ),
          )
        )

      return {
        enabledConversations: userHirings.map( ({ WorkerProfile, HiringWorker }) => ({
          id: HiringWorker.id,
          userId: HiringWorker.userId,
          workerId: WorkerProfile.userId,
        }) )
      }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
