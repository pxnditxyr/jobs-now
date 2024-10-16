import { defineAction } from 'astro:actions'
import { db, desc, User } from 'astro:db'

export const findAllUsers = defineAction({
  accept: 'json',
  handler: async () => {
    const users = await db
      .select()
      .from( User )
      .orderBy(
        desc(
          User.createdAt
        )
      )
    return {
      users
    }
  }
})
