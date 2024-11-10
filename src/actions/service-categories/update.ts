import { defineAction } from 'astro:actions'
import { db, eq, ServiceCategory } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const updateServiceCategory = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string({ message: '👤 El nombre es requerido.' }).min( 2, { message: '👤 El nombre debe tener al menos 2 caracteres.' } ),
    description: z.string({ message: '👤 La descripción es requerida.' }).min( 2, { message: '👤 La descripción debe tener al menos 2 caracteres.' } ),
    icon: z.string().optional(),
    id: z.string({ message: '👤 El id es requerido.' }),
  }),
  handler: async ( {
    id,
    name,
    description,
    icon
  } ) => {


    try {
      await db.update( ServiceCategory ).set({
        id: UUID(),
        name,
        description,
        icon,
      }).where(
        eq( ServiceCategory.id, id )
      )

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
