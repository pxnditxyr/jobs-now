import { defineMiddleware } from 'astro:middleware'
import { getSession } from 'auth-astro/server'
import { getIsRouteAllowed, getRootPathFromRole } from './utils'
import type { TRole } from './interfaces'

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

    return next()
  }
)
