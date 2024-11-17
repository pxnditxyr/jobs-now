import type { AdapterUser } from '@auth/core/adapters'
import Credentials from '@auth/core/providers/credentials'
import { db, eq, User } from 'astro:db'
import { defineConfig } from 'auth-astro'
import bcrypt from 'bcryptjs'

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Correo electrónico', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async ({ email, password }) => {
        const [ user ] = await db
          .select()
          .from( User )
          .where( eq( User.email, `${ email }` ) )

        if ( !user ) {
          const error = new Error( 'UserNotFound' )
          error.name = 'UserNotFound'
          throw error
          //throw new Error( 'Parece que el correo electrónico o la contraseña son incorrectos' )
        }

        if ( bcrypt.compareSync( password as string, user.password ) !== true ) {
          const error = new Error( 'InvalidCredentials' )
          error.name = 'InvalidCredentials'
          throw error
          //throw new Error( 'Parece que el correo electrónico o la contraseña son incorrectos' )
        }

        if ( !user.status ) {
          const error = new Error( 'AccountDisabled' )
          error.name = 'AccountDisabled'
          throw error
          //throw new Error( 'Tu cuenta ha sido deshabilitada, por favor contacta a soporte' )
        }

        const { password: _, ...userData } = user
        return userData
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if ( user ) token.user = user
      return token
    },
    session: ({ session, token }) => {
      session.user = token.user as AdapterUser
      return session
    }
  }
})
