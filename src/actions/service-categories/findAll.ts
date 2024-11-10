import { defineAction } from 'astro:actions'
import { db, desc, ServiceCategory } from 'astro:db'

export const findAllServiceCategories = defineAction({
  accept: 'json',
  handler: async () => {
    const data = await db
      .select()
      .from( ServiceCategory )
      .orderBy(
        desc(
          ServiceCategory.createdAt
        )
      )
    return {
      serviceCategories: data
    }
  }
})
