import { defineAction } from 'astro:actions'
import { db, eq, User, Wallet } from 'astro:db'

export const findOneWalletByUserId = defineAction({
  accept: 'json',
  handler: async ({ userId }) => {
    console.log( 'entra con user id: ', userId )
    const [ data ] = await db
      .select()
      .from( Wallet )
      .where( eq( Wallet.userId, userId ) )

    const allWallets = await db
      .select()
      .from( Wallet )

    console.log({ allWallets })

    console.log({ data })

    if ( !data )
      throw new Error( 'No se encontró la billetera. 💁‍♂️' )

    return {
      wallet: data
    }
  }
})
