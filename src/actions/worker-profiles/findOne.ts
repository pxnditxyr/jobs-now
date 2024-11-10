import { defineAction } from 'astro:actions'
import { db, eq, Role, User } from 'astro:db'

export const findOneWorkerProfile = defineAction({
  accept: 'json',
  handler: async ({ id }) => {
    const [ data ] = await db
      .select()
      .from( User )
      .innerJoin( Role, eq( User.roleId, Role.id ) )
      .where( eq( User.id, id ) )

    if ( !data )
      throw new Error( 'No se encontró el perfil del trabajador. 🤵‍♂️' )

    return {
      user: {
        ...data.User,
        role: data.Role.name,
      }
    }
  }
})
