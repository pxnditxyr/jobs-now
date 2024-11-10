import { signinUser, signoutUser, signupUser } from './auth'
import { findAllCategories } from './service-categories'
import { createUser, findAllUsers, findOneUser, toggleStatusUser, updateUser } from './users'

export const server = {

  // Authentication
  signinUser,
  signupUser,
  signoutUser,

  findAllUsers,
  findOneUser,
  createUser,
  updateUser,
  toggleStatusUser,

  findAllCategories,

}
