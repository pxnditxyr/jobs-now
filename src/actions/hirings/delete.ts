import { defineAction } from 'astro:actions'
import { db, eq, Service } from 'astro:db'
import { z } from 'astro:schema'

export const deleteService = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id del usuario es obligatorio.' }),
  }),

  handler: async ({ id }) => {
    const [ currentData ] = await db
      .select()
      .from( Service )
      .where(
        eq( Service.id, id )
      )

    if ( !currentData )
      throw new Error( 'No se encontró el servicio. 💁‍♂️' )

    await db.update( Service ).set({
      status: false,
      updatedAt: new Date()
    }).where(
      eq( Service.id, id )
    )

    return {
      success: true,
    }
  }
})
