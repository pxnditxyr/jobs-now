import { defineAction } from 'astro:actions'
import { db, eq, ReviewCompletedWork } from 'astro:db'
import { z } from 'astro:schema'


export const updateReviewCompletedWork = defineAction({
  accept: 'form',
  input: z.object({
    id: z.string({ message: '👤 El id es requerido.' }),
    rating: z.number({ message: '👤 La calificación es requerida.' }),
  }),
  handler: async ( {
    id,
    rating,
  } ) => {

    const [ currentData ] = await db
      .select()
      .from( ReviewCompletedWork )
      .where(
        eq( ReviewCompletedWork.id, id )
      )

    console.log({ currentData })
    if ( !currentData )
      throw new Error( 'No se encontró la reseña. 💁‍♂️' )

    try {
      await db.update( ReviewCompletedWork ).set({
        rating,
        state: 'completed',
        updatedAt: new Date()
      }).where(
        eq( ReviewCompletedWork.id, id )
      )

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
