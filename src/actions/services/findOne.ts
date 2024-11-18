import { defineAction } from 'astro:actions'
import { db, eq, Service } from 'astro:db'

export const findOneService = defineAction({
  accept: 'json',
  handler: async ({ id }) => {
    const [ data ] = await db
      .select()
      .from( Service )
      .where( eq( Service.id, id ) )

    if ( !data )
      throw new Error( 'No se encontró la publicación. 🤵‍♂️' )

    return {
      service: data
    }
  }
})
