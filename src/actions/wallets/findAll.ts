import { defineAction } from 'astro:actions'
import { db, desc, eq, Role, User } from 'astro:db'

export const findAllUsers = defineAction({
  accept: 'json',
  handler: async () => {
    const data = await db
      .select()
      .from( User )
      .innerJoin( Role, eq( User.roleId, Role.id ) )
      .orderBy(
        desc(
          User.createdAt
        )
      )
    return {
      users: data.map( ( { User, Role } ) => ( {
        ...User,
        role: Role.name,
      } ) )
    }
  }
})
