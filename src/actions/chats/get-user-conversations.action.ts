import { defineAction } from 'astro:actions'
import { User } from 'astro:db'
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
        .innerJoin( ConversationParticipant, eq( Conversation.id, ConversationParticipant.conversationId ) )
        .where(
          and(
            eq( ConversationParticipant.userId, userId ),
            eq( Conversation.status, true ),
          )
        )
        .orderBy(
          desc(
            Conversation.updatedAt
          )
        )

      const formattedConversationPromises = conversations.map( async ( Conversation ) => ({
        ...Conversation.Conversation,
        participants: await db
          .select()
          .from( ConversationParticipant )
          .innerJoin( User, eq( ConversationParticipant.userId, User.id ) )
          .where(
            and(
              eq( ConversationParticipant.conversationId, Conversation.Conversation.id ),
              eq( ConversationParticipant.status, true ),
            )
          ),
      }) )

      const formattedConversations = await Promise.all( formattedConversationPromises )
      const conversationsWithParticipants = formattedConversations.map( conversation => ({
        ...conversation,
        participants: conversation.participants.map( ({ User }) => ({
          id: User.id,
          name: User.name,
          lastName: User.lastName,
          avatar: User.avatar,
        }) )
      }) )

      return {
        conversations: conversationsWithParticipants,
      }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
