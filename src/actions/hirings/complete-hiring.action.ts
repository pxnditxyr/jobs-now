import { defineAction } from 'astro:actions'
import { db, eq, HiringWorker } from 'astro:db'
import { z } from 'astro:schema'

export const completeHiring = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id del contrato es obligatorio.' }),
  }),

  handler: async ({ id }) => {
    const [ currentData ] = await db
      .select()
      .from( HiringWorker )
      .where(
        eq( HiringWorker.id, id )
      )

    if ( !currentData )
      throw new Error( 'No se encontró el contrato. 💁‍♂️' )

    await db.update( HiringWorker ).set({
      state: 'completed',
      updatedAt: new Date()
    }).where(
      eq( HiringWorker.id, id )
    )

    return {
      success: true,
    }
  }
})
