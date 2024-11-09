import type { TRole } from '@/interfaces'
import { globalAuthenticatedDisallowed, routePermissions } from './disallowed-routes'

export const getIsRouteAllowed = ( role : TRole, pathname : string ) : boolean => {
  if ( role !== 'notAuthenticated' ) {
    for ( const disallowedPath of globalAuthenticatedDisallowed ) {
      if ( pathname.startsWith( disallowedPath ) ) {
        return false
      }
    }
  }

  const rolePermissions = routePermissions[ role ]

  if ( !rolePermissions ) {
    console.log( 'No permissions for role', role )
    return false
  }

  for ( const disallowedPath of rolePermissions.disallowed ) {
    console.log( 'Checking disallowed route', disallowedPath, pathname )
    if ( pathname === disallowedPath || pathname.startsWith( `${ disallowedPath }/` ) ) {
      console.log( 'Disallowed route', disallowedPath )
      return false
    }
  }

  if ( rolePermissions.allowed ) {
    for ( const allowedPath of rolePermissions.allowed ) {
      if ( pathname === allowedPath || pathname.startsWith( `${ allowedPath }/` ) ) {
        console.log( 'Allowed route', allowedPath )
        return true
      }
    }
    console.log( 'No allowed route for role', role )
    return false
  }
  console.log( 'No allowed or disallowed routes for role', role )
  return true
}
