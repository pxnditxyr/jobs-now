/// <reference path="../.astro/types.d.ts" />

interface User {
  name: string
  lastName: string
  email: string
  gender: string
  birthDate: string
  password: string
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean
    user: User | null
  }
}
