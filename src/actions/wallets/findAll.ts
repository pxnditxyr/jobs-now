import { defineAction } from 'astro:actions'
import { db, desc, eq, User, Wallet } from 'astro:db'

export const findAllWallets = defineAction({
  accept: 'json',
  handler: async () => {
    const data = await db
      .select()
      .from( Wallet )
      .innerJoin( User, eq( Wallet.userId, User.id ) )
      .orderBy(
        desc(
          Wallet.createdAt
        )
      )
    return {
      users: data.map( ( { User, Wallet } ) => ( {
        ...Wallet,
        user: User
      } ) )
    }
  }
})
