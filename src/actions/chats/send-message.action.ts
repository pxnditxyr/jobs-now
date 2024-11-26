import { defineAction } from 'astro:actions'
import { db, Message, Conversation, eq, ConversationParticipant, and } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'

export const sendMessage = defineAction({
  accept: 'form',
  input: z.object({
    conversationId: z.string({ required_error: 'El ID de la conversación es requerido.' }),
    senderId: z.string({ required_error: 'El ID del remitente es requerido.' }),
    content: z.string().min(1, { message: 'El contenido del mensaje no puede estar vacío.' }),
    messageType: z.enum(['text', 'image', 'video']).optional().default('text'),
    attachmentUrl: z.string().url().optional(),
  }),
  handler: async ({ conversationId, senderId, content, messageType, attachmentUrl }) => {
    try {
      const [ conversation ] = await db
        .select()
        .from( Conversation )
        .where(
          eq( Conversation.id, conversationId )
        )

      if ( !conversation ) {
        throw new Error( 'La conversación no se encontro 💁‍♂️' )
      }


      const [ isParticipant ] = await db
        .select()
        .from( ConversationParticipant )
        .where(
          and(
            eq( ConversationParticipant.conversationId, conversationId ),
            eq( ConversationParticipant.userId, senderId ),
            eq( ConversationParticipant.status, true ),
          )
        )

      if ( !isParticipant ) {
        throw new Error( 'El usuario no es participante de esta conversación 💁‍♂️' )
      }

      const messageId = UUID()

      await db.insert(Message).values({
        id: messageId,
        conversationId,
        senderId,
        content,
        messageType,
        attachmentUrl: attachmentUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true,
      })

      return { success: true, messageId }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
