import { defineAction } from 'astro:actions'
import { db, desc, eq, Transaction } from 'astro:db'
import { z } from 'astro:schema'

export const findAllTransactionsByWalletId = defineAction({
  accept: 'json',
  input: z.object({
    walletId: z.string({ message: 'El id de la billetera es obligatorio.' }),
  }),
  handler: async ({ walletId }) => {
    const data = await db
      .select()
      .from( Transaction )
      .where( eq( Transaction.walletId, walletId ) )
      .orderBy(
        desc(
          Transaction.createdAt
        )
      )

    return {
      transactions: data
    }
  }
})
