import { defineAction } from 'astro:actions'
import { db, Service } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const createService = defineAction({
  accept: 'form',
  input: z.object({
    workerId: z.string({ message: '👤 El id del trabajador es requerido.' }),
    categoryId: z.string({ message: '👤 El id de la categoría es requerido.' }),
    title: z.string({ message: '👤 El título es requerido.' }),
    description: z.string({ message: '👤 La descripción es requerida.' }),
    imageUrl: z.string({ message: '👤 La imagen es requerida.' }).optional(),
  }),
  handler: async ( {
    workerId,
    categoryId,
    title,
    description,
    imageUrl,
  } ) => {
    try {
      console.log( 'entra' )
      await db.insert( Service ).values({
        id: UUID(),
        workerId,
        categoryId,
        title,
        description,
        imageUrl: imageUrl ?? 'https://st5.depositphotos.com/4509995/64457/i/450/depositphotos_644577382-stock-photo-african-american-girl-vlogger-influencer.jpg',
        starCost: 2,
      })

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
