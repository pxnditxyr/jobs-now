import { signinUser, signoutUser, signupUser } from './auth'
import { findAllUsers, toggleStatusUser } from './users'

export const server = {

  // Authentication
  signinUser,
  signupUser,
  signoutUser,

  findAllUsers,
  toggleStatusUser
}
