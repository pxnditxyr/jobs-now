import { DefaultUser, DefaultSession } from '@auth/core/types'

declare module '@auth/core/types' {
  interface User extends DefaultUser {
    name:       string
    lastName:   string
    email:      string
    roleId:     string
    gender?:    string | null
    birthDate?: string | null
    avatar?:    string | null
    phone?:     string | null
    address?:   string | null
  }

  interface Session extends DefaultSession {
    user: User
  }
}
