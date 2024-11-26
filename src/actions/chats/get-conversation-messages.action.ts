import { defineAction } from 'astro:actions'
import { and, asc, db, eq, Message } from 'astro:db'
import { z } from 'astro:schema'

export const getConversationMessages = defineAction({
  accept: 'json',
  input: z.object({
    conversationId: z.string({ required_error: 'El ID de la conversación es requerido.' }),
    limit: z.number().int().positive().optional().default( 50 ),
    offset: z.number().int().nonnegative().optional().default( 0 ),
  }),
  handler: async ({ conversationId, limit, offset }) => {
    try {
      const messages = await db.select()
        .from( Message )
        .where(
          and(
            eq( Message.conversationId, conversationId ),
            eq( Message.status, true ),
          )
        )
        .orderBy(
          asc(
            Message.createdAt
          )
        )
        .limit( limit )
        .offset( offset )

      const formattedMessages = messages.map( message => ({
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        messageType: message.messageType,
        attachmentUrl: message.attachmentUrl,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      }) )

      return { messages: formattedMessages }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
