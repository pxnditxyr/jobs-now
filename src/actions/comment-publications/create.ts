import { defineAction } from 'astro:actions'
import { CommentService, db } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const createCommentPublication = defineAction({
  accept: 'form',
  input: z.object({
    userId: z.string({ message: '👤 El id del usuario es requerido.' }),
    serviceId: z.string({ message: '👤 El id de la publicación es requerido.' }),
    comment: z.string({ message: '👤 El comentario es requerido.' }),
    rating: z.number({ message: '👤 La calificación es requerida.' }),
  }),
  handler: async ( {
    userId,
    serviceId,
    comment,
    rating,
  } ) => {
    try {
      await db.insert( CommentService ).values({
        id: UUID(),
        userId,
        serviceId,
        comment,
        rating,
        createdAt: new Date(),
      })

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
