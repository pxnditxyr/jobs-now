import { defineAction } from 'astro:actions'
import { db, HiringWorker } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const createHiringWorker = defineAction({
  accept: 'form',
  input: z.object({
    userId: z.string({ message: 'El id del usuario es obligatorio.' }),
    workerProfileId: z.string({ message: 'El id del trabajador es obligatorio.' }),
    contractDate: z.string({ message: 'La fecha de contrato es obligatoria.' }),
    description: z.string({ message: 'La descripción es obligatoria.' }).min( 2, { message: 'La descripción debe tener al menos 2 caracteres.' } ),
  }),
  handler: async ( {
    userId,
    workerProfileId,
    contractDate,
    description,
  } ) => {
    try {
      await db.insert( HiringWorker ).values({
        id: UUID(),
        userId,
        workerProfileId,
        contractDate: new Date( contractDate ),
        description,
        createdAt: new Date(),
      })

      return {
        success: true,
      }
    } catch ( error : any ) {
      console.error( error )
      throw new Error( error )
    }

  }
})
