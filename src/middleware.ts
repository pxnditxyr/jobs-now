import { defineMiddleware } from 'astro:middleware'
import { getSession } from 'auth-astro/server'
import { getIsRouteAllowed, getRootPathFromRole } from './utils'
import type { TRole } from './interfaces'

const clientRoutes = [ '/hire', '/profile', 'hiring-history' ]
const adminRoutes  = [ '/profile', '/users', ]
const workerRoutes = [ '/profile', '/my-services', '/portfolio', '/my-info' ]

export const onRequest = defineMiddleware(
  async ( { url, locals, redirect, request }, next ) => {

    const session = await getSession( request )
    const isLoggedIn = !!session
    const user = session?.user

    locals.isLoggedIn = isLoggedIn
    locals.user = null

    let role : TRole = 'notAuthenticated'

    if ( user ) {
      locals.user = {
        name:      user.name!,
        email:     user.email!,
        lastName:  user.lastName!,
        role:      user.role,
        gender:    user.gender,
        phone:     user.phone,
        address:   user.address,
        birthDate: user.birthDate,
        avatar:    user.avatar,
      }

      role = user.role as TRole
    }

    const isRouteAllowed = getIsRouteAllowed( role, url.pathname )

    if ( !isRouteAllowed ) {
      const rootPath = getRootPathFromRole( role )
      return redirect( rootPath )
    }

    //if ( !isLoggedIn && url.pathname.startsWith( '/dashboard' ) ) {
    //  return redirect( '/auth/signin' )
    //}
    //
    //if ( isLoggedIn && notAuthenticatedRoutes.includes( url.pathname ) ) {
    //  return redirect( '/' )
    //}

    return next()
  }
)
