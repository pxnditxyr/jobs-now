import { defineAction } from 'astro:actions'
import { db, Conversation, ConversationParticipant, Message, eq } from 'astro:db'
import { z } from 'astro:schema'

export const deleteConversation = defineAction({
  accept: 'form',
  input: z.object({
    conversationId: z.string({ required_error: 'El ID de la conversación es requerido.' }),
  }),
  handler: async ({ conversationId }) => {
    try {
      const [ conversation ] = await db.
        select()
        .from( Conversation )
        .where(
          eq( Conversation.id, conversationId )
        )
      if ( !conversation ) {
        throw new Error( 'Conversación no encontrada.' )
      }

      await db.update( Conversation ).set({
        status: false,
        updatedAt: new Date()
      })
      .where(
        eq( Conversation.id, conversationId )
      )

      await db.update( ConversationParticipant ).set({
        status: false,
      }).where(
        eq( ConversationParticipant.conversationId, conversationId )
      )

      await db.update( Message ).set({
        status: false,
        updatedAt: new Date()
      }).where(
        eq( Message.conversationId, conversationId )
      )

      return { success: true }
    } catch (error: any) {
      throw new Error(error.message || 'Error al eliminar la conversación.')
    }
  }
})
