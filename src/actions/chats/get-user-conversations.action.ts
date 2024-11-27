import { defineAction } from 'astro:actions'
import { db, Conversation, ConversationParticipant, eq, and, desc } from 'astro:db'
import { z } from 'astro:schema'

export const getUserConversations = defineAction({
  accept: 'json',
  input: z.object({
    userId: z.string({ required_error: 'El ID del usuario es requerido 👤.' }),
  }),
  handler: async ({ userId }) => {
    try {
      const conversations = await db.select()
        .from( Conversation )
        .where(
          and(
            eq( ConversationParticipant.userId, userId ),
            eq( Conversation.status, true ),
            //eq( ConversationParticipant.status, true ),
          )
        )
        .orderBy(
          desc(
            Conversation.updatedAt
          )
        )

      const formattedConversations = conversations.map( async ( conversation ) => ({
        ...conversation,
        participants: await db
          .select()
          .from( ConversationParticipant )
          .where(
            and(
              eq( ConversationParticipant.conversationId, conversation.id ),
              eq( ConversationParticipant.status, true ),
            )
          ),
      }) )

      return { conversations: await Promise.all( formattedConversations ) }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
