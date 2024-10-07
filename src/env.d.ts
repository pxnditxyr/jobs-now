/// <reference path="../.astro/types.d.ts" />
/// <reference path="astro/client" />

interface User {
  name:       string
  lastName:   string
  email:      string
  role:       string
  gender?:    string | null
  birthDate?: string | null
  avatar?:    string | null
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean
    user: User | null
  }
}
