import { defineAction } from 'astro:actions'
import { db, Conversation, ConversationParticipant, eq, and } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'

export const createConversation = defineAction({
  accept: 'json',
  input: z.object({
    isGroup: z.boolean().optional().default(false),
    name: z.string().optional(),
    participantIds: z.array(z.string()).min(1, { message: 'Debe incluir al menos un participante.' }),
  }).refine( ( data ) => {
    if ( data.isGroup ) {
      return data.name && data.name.trim().length > 0
    }
    return true
  }, {
    message: 'El nombre es requerido para conversaciones grupales.',
    path: [ 'name' ],
  } ),
  handler: async ({ isGroup, name, participantIds }) => {
    try {
      console.log({ participantIds })

      const participantsUser1 = await db
        .select()
        .from( ConversationParticipant )
        .where(
          and(
            eq( ConversationParticipant.userId, participantIds[ 0 ] ),
            eq( ConversationParticipant.status, true ),
          )
        )

      console.log({ participantsUser1 })

      const participantsUser2 = await db
        .select()
        .from( ConversationParticipant )
        .where(
          and(
            eq( ConversationParticipant.userId, participantIds[ 1 ] ),
            eq( ConversationParticipant.status, true ),
          )
        )
      console.log({ participantsUser2 })

      const participantsUser1Id = participantsUser1.map( p => p.conversationId )
      const participantsUser2Id = participantsUser2.map( p => p.conversationId )

      const commonConversationIds = participantsUser1Id.filter( id => participantsUser2Id.includes( id ) )

      if ( commonConversationIds.length > 0 ) {
        const conversationId = commonConversationIds[ 0 ]
        return {
          success: true,
          conversationId,
        };
      }

      // Si no existe, crear una nueva conversación
      const conversationId = UUID()

      await db.insert(Conversation).values({
        id: conversationId,
        isGroup,
        name: isGroup ? name?.trim() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const participants = participantIds.map(userId => ({
        id: UUID(),
        conversationId,
        userId,
        joinedAt: new Date(),
        role: isGroup ? 'member' : 'participant',
        status: true,
      }));

      await db.insert(ConversationParticipant).values(participants);

      return { success: true, conversationId };
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
