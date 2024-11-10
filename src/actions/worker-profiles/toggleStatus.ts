import { defineAction } from 'astro:actions'
import { db, eq, User, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'

export const toggleStatusWorkerProfile = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id del perfil de trabajador es obligatorio.' }),
  }),

  handler: async ( { id } ) => {
    const [ currentWorkerProfile ] = await db
      .select()
      .from( WorkerProfile )
      .where(
        eq( WorkerProfile.id, id )
      )

    if ( !currentWorkerProfile )
      throw new Error( 'No se encontró el perfil del trabajador. 🤵‍♂️' )

    await db.update( WorkerProfile ).set({
      status: !currentWorkerProfile.status,
      updatedAt: new Date()
    }).where(
      eq( User.id, id )
    )
    return {
      success: true,
    }
  }
})
