import { defineAction } from 'astro:actions'
import { db, ServiceCategory } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const createServiceCategory = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string({ message: '👤 El nombre es requerido.' }).min( 2, { message: '👤 El nombre debe tener al menos 2 caracteres.' } ),
    description: z.string({ message: '👥 La descripción es requerida' }).min( 2, { message: '👥 La descripción debe tener al menos 2 caracteres.' } ),
    icon: z.string().optional(),
  }),
  handler: async ( {
    name,
    description,
    icon,
  } ) => {

    try {
      await db.insert( ServiceCategory ).values({
        id: UUID(),
        name,
        description,
        icon: icon || 'mdi:toolbox-outline'
      })

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
