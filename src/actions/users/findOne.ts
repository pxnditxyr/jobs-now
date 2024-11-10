import { defineAction } from 'astro:actions'
import { db, eq, Role, User } from 'astro:db'

export const findOneUser = defineAction({
  accept: 'json',
  handler: async ({ id }) => {
    const [ data ] = await db
      .select()
      .from( User )
      .innerJoin( Role, eq( User.roleId, Role.id ) )
      .where( eq( User.id, id ) )

    console.log({ data })

    if ( !data )
      throw new Error( 'No se encontró el usuario. 💁‍♂️' )

    return {
      user: {
        ...data.User,
        role: data.Role.name,
      }
    }
  }
})
