import { defineAction } from 'astro:actions'
import { db, eq, Service, ServiceCategory } from 'astro:db'

export const findOneService = defineAction({
  accept: 'json',
  handler: async ({ id }) => {
    const [ data ] = await db
      .select()
      .from( Service )
      .innerJoin( ServiceCategory, eq( Service.categoryId, ServiceCategory.id ) )
      .where( eq( Service.id, id ) )

    if ( !data )
      throw new Error( 'No se encontró la publicación. 🤵‍♂️' )

    return {
      service: {
        ...data.Service,
        category: data.ServiceCategory
      }
    }
  }
})
