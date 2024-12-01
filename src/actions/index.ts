import { signupUser } from './auth'
import { addParticipants, createConversation, deleteConversation, deleteMessage, getConversationMessages, getUserConversations, sendMessage, updateMessageStatus } from './chats'
import { createCommentPublication, findAllCommentsByPublicationId } from './comment-publications'
import { createHiringWorker, getAllHiringsByUserId, getAllHiringsByWorkerId, getAllPendingHiringsByWorkerId, getHiringByUserId } from './hirings'
import { approveHiring } from './hirings/approve-hiring.action'
import { completeHiring } from './hirings/complete-hiring.action'
import { rejectHiring } from './hirings/reject-hiring.action'
import { updateProfile } from './profile'
import { createReviewWorker, updateReviewCompletedWork } from './review-completed'
import { findAllPendingRatingByUserId } from './review-completed/findAllByUserId'
import { createServiceCategory, findAllServiceCategories, findOneServiceCategory, toggleStatusServiceCategory, updateServiceCategory } from './service-categories'
import { createService, deleteService, findAllServices, findAllServicesByWorkerId, findOneService, updateService } from './services'
import { findAllTransactionsByWalletId } from './transactions'
import { createUser, findAllUsers, findOneUser, toggleStatusUser, updateUser } from './users'
import { findOneWalletByUserId, paymentAmountWallet, rechargeAmountWallet } from './wallets'
import { approveDisapproveWorkerProfile, createWorkerProfile, findAllWorkerProfiles, findOneWorkerProfile, findOneWorkerProfileByUserId, getRatingByWorkerProfileId, updateWorkerProfile } from './worker-profiles'

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
  paymentAmountWallet,

  updateProfile,

  findAllTransactionsByWalletId,

  findAllWorkerProfiles,
  findOneWorkerProfile,
  createWorkerProfile,
  updateWorkerProfile,
  approveDisapproveWorkerProfile,
  findOneWorkerProfileByUserId,
  getRatingByWorkerProfileId,

  findAllServices,
  findAllServicesByWorkerId,
  findOneService,
  createService,
  updateService,
  deleteService,

  createCommentPublication,
  findAllCommentsByPublicationId,

  createHiringWorker,
  getHiringByUserId,
  getAllHiringsByWorkerId,
  getAllHiringsByUserId,
  approveHiring,
  rejectHiring,
  completeHiring,
  getAllPendingHiringsByWorkerId,

  addParticipants,
  createConversation,
  deleteConversation,
  getUserConversations,
  sendMessage,
  updateMessageStatus,
  deleteMessage,
  getConversationMessages,

  createReviewWorker,
  findAllPendingRatingByUserId,
  updateReviewCompletedWork,
}
