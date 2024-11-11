import { defineAction } from 'astro:actions'
import { db, desc, Transaction } from 'astro:db'

export const findAllTransactions = defineAction({
  accept: 'json',
  handler: async () => {
    const data = await db
      .select()
      .from( Transaction )
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
