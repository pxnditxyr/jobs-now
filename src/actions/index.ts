import { signupUser } from './auth'
import { createServiceCategory, findAllServiceCategories, findOneServiceCategory, toggleStatusServiceCategory, updateServiceCategory } from './service-categories'
import { findAllTransactionsByWalletId } from './transactions'
import { createUser, findAllUsers, findOneUser, toggleStatusUser, updateUser } from './users'
import { findOneWalletByUserId, rechargeAmountWallet } from './wallets'

export const server = {
  signupUser,

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

  findOneWalletByUserId,
  rechargeAmountWallet,


  findAllTransactionsByWalletId,
}
