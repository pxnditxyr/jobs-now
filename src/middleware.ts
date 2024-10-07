import { defineMiddleware } from 'astro:middleware'
import { getSession } from 'auth-astro/server'

const notAuthenticatedRoutes = [ '/auth/signin', '/auth/signup' ]

export const onRequest = defineMiddleware(
  async ( { url, locals, redirect, request }, next ) => {

    const session = await getSession( request )
    const isLoggedIn = !!session
    const user = session?.user

    locals.isLoggedIn = isLoggedIn
    locals.user = null

    if ( user ) {
      locals.user = {
        name:      user.name!,
        email:     user.email!,
        lastName:  user.lastName!,
        role:      user.role,
        gender:    user.gender,
        birthDate: user.birthDate,
        avatar:    user.avatar,
      }
    }

    if ( !isLoggedIn && url.pathname.startsWith( '/dashboard' ) ) {
      return redirect( '/auth/signin' )
    }

    if ( isLoggedIn && notAuthenticatedRoutes.includes( url.pathname ) ) {
      return redirect( '/' )
    }

    return next()
  }
)
