/// <reference path="../.astro/types.d.ts" />

interface User {
  name:       string
  email:      string
  lastName?:  string
  gender?:    string
  birthDate?: string
  avatar?:    string
  role?:      string
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean
    user: User | null
  }
}
