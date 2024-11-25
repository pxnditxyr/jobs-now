import { defineAction } from 'astro:actions'
import { db, desc, eq, HiringWorker, User, WorkerProfile } from 'astro:db'

export const getAllHiringsByUserId = defineAction({
  accept: 'json',
  handler: async ({ userId }) => {
    const data = await db
      .select()
      .from( HiringWorker )
      .innerJoin( User, eq( HiringWorker.userId, User.id ) )
      .innerJoin( WorkerProfile, eq( HiringWorker.workerProfileId, WorkerProfile.id ) )
      .where( eq( HiringWorker.userId, userId ) )
      .orderBy(
        desc(
          HiringWorker.createdAt
        )
      )

    return {
      hirings: data.map( ( { HiringWorker, User, WorkerProfile } ) => ( {
        ...HiringWorker,
        user: User,
        workerProfile: WorkerProfile
      } ) )
    }
  }
})
