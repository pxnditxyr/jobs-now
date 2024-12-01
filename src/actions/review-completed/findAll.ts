import { defineAction } from 'astro:actions'
import { db, desc, eq, ReviewCompletedWork } from 'astro:db'
import { z } from 'astro:schema'

export const findAllRatingByWorkerProfileId = defineAction({
  accept: 'json',
  input: z.object({
    workerProfileId: z.string({ message: 'El id del trabajador es obligatorio.' }),
  }),
  handler: async ({ workerProfileId }) => {
    const data = await db
      .select()
      .from( ReviewCompletedWork )
      .where(
        eq( ReviewCompletedWork.workerProfileId, workerProfileId )
      )
      .orderBy(
        desc(
          ReviewCompletedWork.createdAt
        )
      )

    return {
      services: data
    }
  }
})
