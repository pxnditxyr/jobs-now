import { defineAction } from 'astro:actions'
import { db, eq, ServiceCategory } from 'astro:db'

export const findOneServiceCategory = defineAction({
  accept: 'json',
  handler: async ({ id }) => {
    const [ data ] = await db
      .select()
      .from( ServiceCategory )
      .where( eq( ServiceCategory.id, id ) )

    console.log({ data })

    if ( !data )
      throw new Error( 'No se encontró el usuario. 💁‍♂️' )

    return {
      serviceCategory: data
    }
  }
})
