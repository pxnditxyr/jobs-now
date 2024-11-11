import { defineAction } from 'astro:actions'
import { db, eq, Wallet } from 'astro:db'

export const findOneWalletByUserId = defineAction({
  accept: 'json',
  handler: async ({ userId }) => {
    const [ data ] = await db
      .select()
      .from( Wallet )
      .where( eq( Wallet.userId, userId ) )

    if ( !data )
      throw new Error( 'No se encontró la billetera. 💁‍♂️' )

    return {
      wallet: data
    }
  }
})
