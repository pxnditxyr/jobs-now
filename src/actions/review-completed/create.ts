import { defineAction } from 'astro:actions'
import { db, ReviewCompletedWork } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const createReviewWorker = defineAction({
  accept: 'json',
  input: z.object({
    userId: z.string({ message: '👤 El id del usuario es requerido.' }),
    workerProfileId: z.string({ message: '👤 El id del trabajador es requerido.' }),
  }),
  handler: async ( {
    userId,
    workerProfileId,
  } ) => {
    try {
      await db.insert( ReviewCompletedWork ).values({
        id: UUID(),
        userId,
        workerProfileId,
        rating: 0,
        createdAt: new Date(),
      })

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
