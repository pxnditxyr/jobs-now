import { DefaultUser, DefaultSession } from '@auth/core/types'

declare module '@auth/core/types' {
  interface User extends DefaultUser {
    name:       string
    role:       string
    lastName:   string
    gender?:    string | null
    birthDate?: string | null
    avatar?:    string | null
  }

  interface Session extends DefaultSession {
    user: User
  }
}
