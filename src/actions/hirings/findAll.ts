import { defineAction } from 'astro:actions'
import { db, desc, Service } from 'astro:db'

export const findAllServices = defineAction({
  accept: 'json',
  handler: async () => {
    const data = await db
      .select()
      .from( Service )
      .orderBy(
        desc(
          Service.createdAt
        )
      )
    return {
      services: data
    }
  }
})
