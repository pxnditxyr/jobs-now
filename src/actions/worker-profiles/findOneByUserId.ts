import { defineAction } from 'astro:actions'
import { db, eq, WorkerProfile } from 'astro:db'

export const findOneWorkerProfileByUserId = defineAction({
  accept: 'json',
  handler: async ({ userId }) => {
    const [ data ] = await db
      .select()
      .from( WorkerProfile )
      .where( eq( WorkerProfile.userId, userId ) )

    if ( !data )
      throw new Error( 'No se encontró el perfil del trabajador. 🤵‍♂️' )

    return {
      workerProfile: data
    }
  }
})
