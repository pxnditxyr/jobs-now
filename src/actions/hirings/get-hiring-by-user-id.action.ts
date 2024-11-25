
import { defineAction } from 'astro:actions'
import { and, db, eq, HiringWorker } from 'astro:db'

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
    return {
      hiring: data
    }
  }
})

