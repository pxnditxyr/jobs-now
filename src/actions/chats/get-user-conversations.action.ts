import { defineAction } from 'astro:actions'
import { db, Conversation, ConversationParticipant, eq, and, desc } from 'astro:db'
import { z } from 'astro:schema'

export const getUserConversations = defineAction({
  accept: 'json',
  input: z.object({
    userId: z.string({ required_error: 'El ID del usuario es requerido.' }),
  }),
  handler: async ({ userId }) => {
    try {
      const conversations = await db.select()
        .from( Conversation )
        .innerJoin(
          ConversationParticipant, eq( Conversation.id, ConversationParticipant.conversationId )
        )
        .where(
          and(
            eq( ConversationParticipant.userId, userId ),
            eq( Conversation.status, true ),
            eq( ConversationParticipant.status, true ),
          )
        )
        .orderBy(
          desc(
            Conversation.updatedAt
          )
        )

      const formattedConversations = conversations.map( ({ Conversation }) => ({
        id: Conversation.id,
        isGroup: Conversation.isGroup,
        name: Conversation.isGroup ? Conversation.name : null,
        createdAt: Conversation.createdAt,
        updatedAt: Conversation.updatedAt,
      }) )

      return { conversations: formattedConversations }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
