import { defineAction } from 'astro:actions'
import { db, Conversation, ConversationParticipant } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'

export const createConversation = defineAction({
  accept: 'form',
  input: z.object({
    isGroup: z.boolean().optional().default(false),
    name: z.string().optional(),
    participantIds: z.array(z.string()).min(1, { message: 'Debe incluir al menos un participante.' }),
  }).refine((data) => {
    if (data.isGroup) {
      return data.name && data.name.trim().length > 0
    }
    return true
  }, {
    message: 'El nombre es requerido para conversaciones grupales.',
    path: ['name'],
  }),
  handler: async ({ isGroup, name, participantIds }) => {
    try {
      const conversationId = UUID()

      await db.insert(Conversation).values({
        id: conversationId,
        isGroup,
        name: isGroup ? name?.trim() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Insertar participantes
      const participants = participantIds.map(userId => ({
        id: UUID(),
        conversationId,
        userId,
        joinedAt: new Date(),
        role: isGroup ? 'member' : 'participant',
        status: true,
      }))

      await db.insert( ConversationParticipant ).values(participants)

      return { success: true, conversationId }
    } catch (error: any) {
      throw new Error(error.message || 'Error al crear la conversación.')
    }
  }
})
