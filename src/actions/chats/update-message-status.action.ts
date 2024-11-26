import { defineAction } from 'astro:actions'
import { db, MessageStatus } from 'astro:db'
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
      // Verificar si ya existe un registro de estado para este mensaje y usuario
      const existingStatus = await db.select().from(MessageStatus).where({ messageId, userId }).first()

      if (existingStatus) {
        // Actualizar el estado existente
        await db.update(MessageStatus).set({
          isRead,
          readAt: isRead ? new Date() : null,
          updatedAt: new Date(),
        }).where({ id: existingStatus.id })
      } else {
        // Crear un nuevo registro de estado
        await db.insert(MessageStatus).values({
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
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar el estado del mensaje.')
    }
  }
})
