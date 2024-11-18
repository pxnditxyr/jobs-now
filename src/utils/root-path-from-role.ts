import type { TRole } from '@/interfaces'

interface IRolePath {
  [ key : string ]: string
}

export const rootPathFromRole : IRolePath = {
  'admin': '/admin',
  'worker': '/worker',
  'client': '/client',
  'notAuthenticated': '/auth/signin'
}

export const getRootPathFromRole = ( role : TRole ) : string => {
  return rootPathFromRole[ role ]
}
