import { defineAction } from 'astro:actions'
import { db, desc, eq, User, WorkerProfile } from 'astro:db'

export const findAllWorkerProfiles = defineAction({
  accept: 'json',
  handler: async () => {
    const data = await db
      .select()
      .from( WorkerProfile )
      .innerJoin( User, eq( User.id, WorkerProfile.userId ) )
      .orderBy(
        desc(
          WorkerProfile.createdAt
        )
      )
    return {
      workerProfiles: data.map( ( { WorkerProfile, User } ) => ( {
        ...WorkerProfile,
        user: User
      } ) )
    }
  }
})
