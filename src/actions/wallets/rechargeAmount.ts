import { defineAction } from 'astro:actions'
import { db, eq, Transaction, Wallet } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'

export const rechargeAmountWallet = defineAction({
  accept: 'json',

  input: z.object({
    id: z.string({ message: 'El id del usuario es obligatorio.' }),
    amount: z.number({ message: 'El monto es obligatorio.' }),
  }),

  handler: async ({ id, amount }) => {

    const [ currentWallet ] = await db
      .select()
      .from( Wallet )
      .where( eq( Wallet.id, id ) )

    if ( !currentWallet ) {
      throw new Error( 'No se encontró la billetera. 💁‍♂️' )
    }

    await db.update( Wallet ).set({
      balance: currentWallet.balance + amount,
      updatedAt: new Date()
    }).where(
      eq( Wallet.id, id )
    )

    await db.insert( Transaction ).values({
      id: UUID(),
      walletId: id,
      amount,
      description: `Recarga de $${ amount }`,
    })

    return {
      success: true,
    }
  }
})
