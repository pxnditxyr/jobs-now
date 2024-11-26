import { defineAction } from 'astro:actions'
import { db, Conversation, ConversationParticipant, Message, MessageStatus } from 'astro:db'
import { z } from 'astro:schema'

export const deleteConversation = defineAction({
  accept: 'form',
  input: z.object({
    conversationId: z.string({ required_error: 'El ID de la conversación es requerido.' }),
  }),
  handler: async ({ conversationId }) => {
    try {
      // Verificar si la conversación existe
      const conversation = await db.select().from(Conversation).where({ id: conversationId }).first()
      if (!conversation) {
        throw new Error('Conversación no encontrada.')
      }

      // Soft delete: actualizar el estado a false
      await db.update(Conversation).set({ status: false, updatedAt: new Date() }).where({ id: conversationId })

      // Soft delete de participantes
      await db.update(ConversationParticipant).set({ status: false, updatedAt: new Date() }).where({ conversationId })

      // Soft delete de mensajes
      await db.update(Message).set({ status: false, updatedAt: new Date() }).where({ conversationId })

      // Opcional: soft delete de estados de mensajes
      await db.update(MessageStatus).set({ isRead: false, readAt: null, updatedAt: new Date() }).where({
        messageId: db.select().from(Message).where({ conversationId }),
      })

      return { success: true }
    } catch (error: any) {
      throw new Error(error.message || 'Error al eliminar la conversación.')
    }
  }
})
