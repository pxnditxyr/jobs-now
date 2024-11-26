import { defineAction } from 'astro:actions'
import { db, eq, Message, MessageStatus } from 'astro:db'
import { z } from 'astro:schema'

export const deleteMessage = defineAction({
  accept: 'form',
  input: z.object({
    messageId: z.string({ required_error: 'El ID del mensaje es requerido.' }),
  }),
  handler: async ({ messageId }) => {
    try {
      const [ message ] = await db
        .select()
        .from( Message )
        .where(
          eq( Message.id, messageId )
        )
      if ( !message ) {
        throw new Error( 'El mensaje no se encontro 💁‍♂️' )
      }

      await db.update( Message ).set({
        status: false,
        updatedAt: new Date()
      })
      .where(
        eq( Message.id, messageId )
      )

      await db.update( MessageStatus ).set({
        isRead: false,
        readAt: null,
        updatedAt: new Date()
      }).where(
        eq( MessageStatus.messageId, messageId )
      )

      return { success: true }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
