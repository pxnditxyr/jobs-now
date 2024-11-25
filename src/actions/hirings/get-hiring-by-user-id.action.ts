
import { defineAction } from 'astro:actions'
import { and, db, desc, eq, HiringWorker } from 'astro:db'

export const getHiringByUserId = defineAction({
  accept: 'json',
  handler: async ({ userId, wokerProfileId }) => {
    const [ data ] = await db
      .select()
      .from( HiringWorker )
      .where(
        and(
          eq( HiringWorker.userId, userId ),
          eq( HiringWorker.workerProfileId, wokerProfileId ),
        )
      )
      .orderBy(
        desc( HiringWorker.createdAt )
      )

    return {
      hiring: data
    }
  }
})

