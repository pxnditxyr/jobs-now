import { defineAction } from 'astro:actions'
import { db, desc, eq, ServiceCategory } from 'astro:db'
import { z } from 'astro:schema'


export const findAllCategories = defineAction({
  accept: 'json',
  input: z.object({
    search: z.string().optional(),
  }),
  handler: async ( { search } ) => {
    const data = await db
      .select()
      .from( ServiceCategory )
      .orderBy(
        desc(
          ServiceCategory.createdAt
        )
      )

    return { data }
  }
})
