
interface IPermissions {
  [ key : string ]: {
    allowed?: string[]
    disallowed: string[]
  }
}

export const routePermissions : IPermissions = {
  admin: {
    disallowed: [ '/', '/my-services', '/portfolio', '/my-info' ]
  },
  worker: {
    disallowed: [ '/', '/hire', '/user', '/hire', '/admin', '/client' ]
  },
  client: {
    disallowed: [ '/my-services', '/portfolio', '/my-info', '/admin', '/worker' ]
  },
  notAuthenticated: {
    //allowed: [ '/auth/signin', '/auth/signup' ],
    disallowed: [ '/profile', '/users', '/hire', '/hiring-history', '/my-services', '/portfolio', '/my-info', '/admin', '/worker', '/client' ]
  }
}

export const globalAuthenticatedDisallowed = [ '/auth/signin', '/auth/signup' ]
