import { defineAction } from 'astro:actions'
import { db, Conversation, ConversationParticipant } from 'astro:db'
import { z } from 'astro:schema'

export const getUserConversations = defineAction({
  accept: 'json',
  input: z.object({
    userId: z.string({ required_error: 'El ID del usuario es requerido.' }),
  }),
  handler: async ({ userId }) => {
    try {
      const conversations = await db.select()
        .from(Conversation)
        .innerJoin(ConversationParticipant, {
          'Conversation.id': 'ConversationParticipant.conversationId'
        })
        .where({
          'ConversationParticipant.userId': userId,
          'Conversation.status': true,
          'ConversationParticipant.status': true,
        })
        .orderBy('Conversation.updatedAt', 'desc')

      const formattedConversations = conversations.map(({ Conversation }) => ({
        id: Conversation.id,
        isGroup: Conversation.isGroup,
        name: Conversation.isGroup ? Conversation.name : null,
        createdAt: Conversation.createdAt,
        updatedAt: Conversation.updatedAt,
      }))

      return { conversations: formattedConversations }
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener las conversaciones del usuario.')
    }
  }
})
