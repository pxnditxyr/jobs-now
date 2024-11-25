import { defineAction } from 'astro:actions'
import { db, desc, eq, Service, ServiceCategory } from 'astro:db'

export const findAllHiringsByWorkerId = defineAction({
  accept: 'json',
  handler: async ({ workerId }) => {
    const data = await db
      .select()
      .from( Service )
      .where( eq( Service.workerId, workerId ) )
      .innerJoin( ServiceCategory, eq( Service.categoryId, ServiceCategory.id ) )
      .orderBy(
        desc(
          Service.createdAt
        )
      )
    return {
      services: data.map( ( { Service, ServiceCategory } ) => ( {
        ...Service,
        category: ServiceCategory
      } ) )
    }
  }
})
