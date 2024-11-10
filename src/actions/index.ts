import { signinUser, signoutUser, signupUser } from './auth'
import { createServiceCategory, findAllServiceCategories, findOneServiceCategory, toggleStatusServiceCategory, updateServiceCategory } from './service-categories'
import { createUser, findAllUsers, findOneUser, toggleStatusUser, updateUser } from './users'

export const server = {
  signinUser,
  signupUser,
  signoutUser,

  findAllUsers,
  findOneUser,
  createUser,
  updateUser,
  toggleStatusUser,

  findAllServiceCategories,
  findOneServiceCategory,
  createServiceCategory,
  updateServiceCategory,
  toggleStatusServiceCategory,
}
