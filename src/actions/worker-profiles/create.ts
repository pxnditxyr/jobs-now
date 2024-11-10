import { defineAction } from 'astro:actions'
import { db, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const createWorkerProfile = defineAction({
  accept: 'form',
  input: z.object({
    userId: z.string({ message: '👤 El usuario es requerido.' }),
  }),
  handler: async ({
    userId,
  }) => {
    try {
      await db.insert( WorkerProfile ).values({
        id: UUID(),
        userId
      })

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
