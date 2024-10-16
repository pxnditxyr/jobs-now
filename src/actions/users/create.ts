import { defineAction } from 'astro:actions'
import { db, DisasterType } from 'astro:db'
import { z } from 'astro:schema'

export const createDisasterType = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min( 2, { message: '👤 El nombre debe tener al menos 2 caracteres.' } ),
    description: z.string().min( 2, { message: '📝 La descripción debe tener al menos 2 caracteres.' } ),
    icon: z.string({ message: '📸 La imagen debe ser una URL válida.' } ).optional(),
    imageUrl: z.string({ message: '📸 La imagen debe ser una URL válida.' } ).optional(),
  }),
  handler: async ( { name, description, icon, imageUrl } ) => {
    await db.insert( DisasterType ).values({
      name,
      description,
      icon,
      imageUrl,
    })

    return {
      success: true,
    }
  }
})
