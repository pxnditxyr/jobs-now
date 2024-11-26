import { defineAction } from 'astro:actions'
import { db, ConversationParticipant, Conversation } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'

export const addParticipants = defineAction({
  accept: 'form',
  input: z.object({
    conversationId: z.string({ required_error: 'El ID de la conversación es requerido.' }),
    participantIds: z.array(z.string()).min(1, { message: 'Debe incluir al menos un participante.' }),
  }),
  handler: async ({ conversationId, participantIds }) => {
    try {
      // Verificar si la conversación existe
      const conversation = await db.select().from(Conversation).where({ id: conversationId }).first()
      if (!conversation) {
        throw new Error('Conversación no encontrada.')
      }

      // Verificar si es una conversación grupal
      if (!conversation.isGroup) {
        throw new Error('Solo se pueden agregar participantes a conversaciones grupales.')
      }

      // Insertar nuevos participantes
      const newParticipants = participantIds.map(userId => ({
        id: UUID(),
        conversationId,
        userId,
        joinedAt: new Date(),
        role: 'member',
        status: true,
      }))

      await db.insert(ConversationParticipant).values(newParticipants)

      return { success: true }
    } catch (error: any) {
      throw new Error(error.message || 'Error al agregar participantes.')
    }
  }
})
