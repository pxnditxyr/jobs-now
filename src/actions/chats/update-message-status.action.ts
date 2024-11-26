import { defineAction } from 'astro:actions'
import { and, db, eq, MessageStatus } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'

export const updateMessageStatus = defineAction({
  accept: 'form',
  input: z.object({
    messageId: z.string({ required_error: 'El ID del mensaje es requerido.' }),
    userId: z.string({ required_error: 'El ID del usuario es requerido.' }),
    isRead: z.boolean().optional().default(true),
  }),
  handler: async ({ messageId, userId, isRead }) => {
    try {
      const [ existingStatus ] = await db
        .select()
        .from( MessageStatus )
        .where(
          and(
            eq( MessageStatus.messageId, messageId ),
            eq( MessageStatus.userId, userId ),
          )
        )

      if ( existingStatus ) {
        await db.update( MessageStatus ).set({
          isRead,
          readAt: isRead ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(
          eq( MessageStatus.messageId, existingStatus.id ),
        )
      } else {
        await db.insert( MessageStatus ).values({
          id: UUID(),
          messageId,
          userId,
          isRead,
          readAt: isRead ? new Date() : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      return { success: true }
    } catch ( error: any ) {
      throw new Error( error )
    }
  }
})
