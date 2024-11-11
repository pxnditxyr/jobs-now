import { defineAction } from 'astro:actions'
import { db, eq, Wallet } from 'astro:db'
import { z } from 'astro:schema'

export const toggleStatusWallet = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id del usuario es obligatorio.' }),
  }),

  handler: async ( { id } ) => {
    const [ currentWallet ] = await db
      .select()
      .from( Wallet )
      .where( eq( Wallet.id, id ) )

    if ( !currentWallet ) {
      throw new Error( 'No se encontró la billetera. 💁‍♂️' )
    }

    await db.update( Wallet ).set({
      status: !currentWallet.status,
      updatedAt: new Date()
    }).where(
      eq( Wallet.id, id )
    )
    return {
      success: true,
    }
  }
})
