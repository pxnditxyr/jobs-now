import { defineAction } from 'astro:actions'
import { db, eq, Service } from 'astro:db'
import { z } from 'astro:schema'

export const deleteService = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id del usuario es obligatorio.' }),
  }),

  handler: async ({ id }) => {
    await db.delete( Service ).where(
      eq( Service.id, id )
    )
    return {
      success: true,
    }
  }
})
