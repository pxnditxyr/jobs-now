import { defineAction } from 'astro:actions'
import { db, eq, User, Wallet } from 'astro:db'

export const findOneWallet = defineAction({
  accept: 'json',
  handler: async ({ id }) => {
    const [ data ] = await db
      .select()
      .from( Wallet )
      .innerJoin( User, eq( Wallet.userId, User.id ) )
      .where( eq( Wallet.id, id ) )

    if ( !data )
      throw new Error( 'No se encontró la billetera. 💁‍♂️' )

    return {
      wallet: {
        ...data.Wallet,
        user: data.User
      }
    }
  }
})
