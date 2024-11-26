import { defineAction } from 'astro:actions'
import { db, Message, MessageStatus } from 'astro:db'
import { z } from 'astro:schema'

export const deleteMessage = defineAction({
  accept: 'form',
  input: z.object({
    messageId: z.string({ required_error: 'El ID del mensaje es requerido.' }),
  }),
  handler: async ({ messageId }) => {
    try {
      // Verificar si el mensaje existe
      const message = await db.select().from(Message).where({ id: messageId }).first()
      if (!message) {
        throw new Error('Mensaje no encontrado.')
      }

      // Soft delete: actualizar el estado a false
      await db.update(Message).set({ status: false, updatedAt: new Date() }).where({ id: messageId })

      // Soft delete de estados de mensajes
      await db.update(MessageStatus).set({ isRead: false, readAt: null, updatedAt: new Date() }).where({ messageId })

      return { success: true }
    } catch (error: any) {
      throw new Error(error.message || 'Error al eliminar el mensaje.')
    }
  }
})
