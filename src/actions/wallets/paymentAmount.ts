import { defineAction } from 'astro:actions'
import { db, eq, Transaction, Wallet } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'

export const paymentAmountWallet = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string({ message: 'El id de la billetera es obligatorio.' }),
    amount: z.number({ message: 'El monto es obligatorio.' }),
    stars: z.number({ message: 'Las estrellas son obligatorias.' }),
  }),

  handler: async ({ id, amount, stars }) => {

    const [ currentWallet ] = await db
      .select()
      .from( Wallet )
      .where( eq( Wallet.id, id ) )

    if ( !currentWallet ) {
      throw new Error( 'No se encontró la billetera. 💁‍♂️' )
    }
    if ( currentWallet.balance - amount < 0 ) {
      throw new Error( 'No hay suficiente saldo para realizar la transferencia. 💸' )
    }
    if ( currentWallet.stars - stars < 0 ) {
      throw new Error( 'No hay suficiente estrellas para realizar la transferencia. 💸' )
    }

    await db.update( Wallet ).set({
      balance: currentWallet.balance - amount,
      stars: currentWallet.stars - stars,
      updatedAt: new Date()
    }).where(
      eq( Wallet.id, id )
    )

    await db.insert( Transaction ).values({
      id: UUID(),
      walletId: id,
      amount,
      stars,
      description: `Cobro por contratación de trabajador ${ stars } estrellas`,
      createdAt: new Date(),
    })

    return {
      success: true,
    }
  }
})
