import { defineMiddleware } from 'astro:middleware'

const notAuthenticatedRoutes = [ '/auth/signin', '/auth/signup' ]

export const onRequest = defineMiddleware(
  async ( { url, locals, redirect }, next ) => {
    const isLoggedIn = false

    locals.isLoggedIn = isLoggedIn
    locals.user = null

    if ( locals.user ) {

    }

    if ( !isLoggedIn && url.pathname.startsWith( '/dashboard' ) ) {
      return redirect( '/auth/signin' )
    }


    if ( isLoggedIn && notAuthenticatedRoutes.includes( url.pathname ) ) {
      return redirect( '/dashboard' )
    }

    return next()
  }
)
