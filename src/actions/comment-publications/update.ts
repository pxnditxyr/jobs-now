import { defineAction } from 'astro:actions'
import { db, eq, Service } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const updateService = defineAction({
  accept: 'form',
  input: z.object({
    categoryId: z.string({ message: '👤 El id es requerido.' }),
    title: z.string({ message: '👤 El id es requerido.' }),
    description: z.string({ message: '👤 El id es requerido.' }),
    imageUrl: z.string({ message: '👤 El id es requerido.' }).optional(),
    id: z.string({ message: '👤 El id es requerido.' }),
  }),
  handler: async ( {
    id,
    title,
    description,
    imageUrl,
    categoryId,
  } ) => {

    console.log( 'entra' )
    console.log( { id, title, description, imageUrl, categoryId } )

    try {
      await db.update( Service ).set({
        id: UUID(),
        description,
        title,
        imageUrl: imageUrl ? imageUrl : 'https://st5.depositphotos.com/4509995/64457/i/450/depositphotos_644577382-stock-photo-african-american-girl-vlogger-influencer.jpg',
        categoryId,
      }).where(
        eq( Service.id, id )
      )

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
