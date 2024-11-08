import { signinUser, signoutUser, signupUser } from './auth'
import { findAllCategories } from './service-categories'
import { findAllUsers, toggleStatusUser } from './users'

export const server = {

  // Authentication
  signinUser,
  signupUser,
  signoutUser,

  findAllUsers,
  toggleStatusUser,

  findAllCategories,
}
