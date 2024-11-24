import { defineAction } from 'astro:actions'
import { CommentService, db, desc, eq, Service, User } from 'astro:db'

export const findAllCommentsByPublicationId = defineAction({
  accept: 'json',
  handler: async ({ publicationId }) => {
    const data = await db
      .select()
      .from( CommentService )
      .where( eq( CommentService.serviceId, publicationId ) )
      .innerJoin( Service, eq( CommentService.serviceId, Service.id ) )
      .innerJoin( User, eq( CommentService.userId, User.id ) )
      .orderBy(
        desc(
          Service.createdAt
        )
      )
    return {
      publicationComments: data.map( ( { Service, CommentService, User } ) => ({
        ...CommentService,
        service: Service,
        user: User
      }) )
    }
  }
})
