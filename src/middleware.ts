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

    let roleId : TRole = 'notAuthenticated'

    if ( user ) {
      locals.user = {
        name:      user.name!,
        email:     user.email!,
        lastName:  user.lastName!,
        roleId:    user.roleId,
        gender:    user.gender,
        phone:     user.phone,
        address:   user.address,
        birthDate: user.birthDate,
        avatar:    user.avatar,
      }

      roleId = user.roleId as TRole
    }

    const isRouteAllowed = getIsRouteAllowed( roleId, url.pathname )

    if ( !isRouteAllowed ) {
      const rootPath = getRootPathFromRole( roleId )
      return redirect( rootPath )
    }

    return next()
  }
)
