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
          throw new Error( 'Parece que el correo electrónico o la contraseña son incorrectos' )
        }

        if ( bcrypt.compareSync( password as string, user.password ) !== true ) {
          throw new Error( 'Parece que el correo electrónico o la contraseña son incorrectos' )
        }

        const { password: _, ...userData } = user
        return userData
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if ( user ) token.user = user
      return token
    },
    session: ({ session, token }) => {
      session.user = token.user as AdapterUser
      return session
    }
  }
})
