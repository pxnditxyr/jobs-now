import { defineAction } from 'astro:actions'
import { db, eq, User } from 'astro:db'
import { z } from 'astro:schema'

export const toggleStatusUser = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id del usuario es obligatorio.' }),
  }),

  handler: async ( { id } ) => {

    const [ currentData ] = await db
      .select()
      .from( User )
      .where(
        eq( User.id, id )
      )

    if ( !currentData )
      throw new Error( 'No se encontró el usuario. 💁‍♂️' )

    await db.update( User ).set({
      status: !currentData.status,
      updatedAt: new Date()
    }).where(
      eq( User.id, id )
    )

    return {
      success: true,
    }
  }
})
