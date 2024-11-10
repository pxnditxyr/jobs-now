import { defineAction } from 'astro:actions'
import { db, eq, ServiceCategory } from 'astro:db'
import { z } from 'astro:schema'

export const toggleStatusServiceCategory = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id del usuario es obligatorio.' }),
    currentStatus: z.boolean({ message: 'El estado actual del usuario es obligatorio.' }),
  }),

  handler: async ( { id, currentStatus } ) => {
    await db.update( ServiceCategory ).set({
      status: !currentStatus,
      updatedAt: new Date()
    }).where(
      eq( ServiceCategory.id, id )
    )
    return {
      success: true,
    }
  }
})
