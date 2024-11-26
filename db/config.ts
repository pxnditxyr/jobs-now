import { column, defineDb, defineTable } from 'astro:db'

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      unique: true,
    }),

    name: column.text(),
    lastName: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),

    gender: column.text({ optional: true }),
    birthDate: column.text({ optional: true }),

    phone: column.text({ optional: true }),
    address: column.text({ optional: true }),
    avatar: column.text({ optional: true }),

    roleId: column.text({ references: () => Role.columns.id }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  },
})

const WorkerProfile = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true, }),

    userId: column.text({ references: () => User.columns.id }),
    description: column.text({ optional: true }),
    dni: column.text({ optional: true }),
    portfolio: column.text({ optional: true }),
    education: column.text({ optional: true }),
    experience: column.text({ optional: true }),
    skills: column.text({ optional: true }),
    interests: column.text({ optional: true }),
    about: column.text({ optional: true }),

    approved: column.boolean({ default: false }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  },
})

const Role = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text(),
  },
})

const ServiceCategory = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text(),
    description: column.text(),
    icon: column.text(),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const Service = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    workerId: column.text({ references: () => WorkerProfile.columns.id }),
    categoryId: column.text({ references: () => ServiceCategory.columns.id }),
    title: column.text(),
    description: column.text(),
    imageUrl: column.text(),
    starCost: column.number(),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const CommentService = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }),
    serviceId: column.text({ references: () => Service.columns.id }),
    comment: column.text(),
    rating: column.number(),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const Wallet = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }),
    balance: column.number({ default: 0 }),
    stars: column.number({ default: 0 }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const Transaction = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    walletId: column.text({ references: () => Wallet.columns.id }),
    amount: column.number(),
    stars: column.number(),
    description: column.text(),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const HiringService = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }),
    serviceId: column.text({ references: () => Service.columns.id }),
    contractDate: column.date(),
    state: column.text({ default: 'pending' }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const HiringWorker = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }),
    workerProfileId: column.text({ references: () => WorkerProfile.columns.id }),
    contractDate: column.date(),
    description: column.text(),
    state: column.text({ default: 'pending' }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const ReviewCompletedWork = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    hiringWorkerId: column.text({ references: () => HiringWorker.columns.id }),
    userId: column.text({ references: () => User.columns.id }),
    rating: column.number(),
    state: column.text({ default: 'pending' }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const Analytic = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }),
    action: column.text(),
    description: column.text(),
    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const ReviewWorker = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }),
    workerProfileId: column.text({ references: () => WorkerProfile.columns.id }),
    rating: column.number(),
    state: column.text({ default: 'pending' }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const Follower = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }),
    workerId: column.text({ references: () => WorkerProfile.columns.id }),
    followedAt: column.date({ default: new Date() }),
  },
})


const Conversation = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),

    isGroup: column.boolean({ default: false }),
    name: column.text({ optional: true }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  },
})


const ConversationParticipant = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),

    conversationId: column.text({ references: () => Conversation.columns.id }),
    userId: column.text({ references: () => User.columns.id }),
    joinedAt: column.date({ default: new Date() }),

    role: column.text({ optional: true }),
    status: column.boolean({ default: true }),
  },
})

const Message = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),

    conversationId: column.text({ references: () => Conversation.columns.id }),
    senderId: column.text({ references: () => User.columns.id }),
    content: column.text(),
    messageType: column.text({ default: 'text' }),
    attachmentUrl: column.text({ optional: true }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  },
})


const MessageStatus = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),

    messageId: column.text({ references: () => Message.columns.id }),
    userId: column.text({ references: () => User.columns.id }),
    isRead: column.boolean({ default: false }),
    readAt: column.date({ optional: true }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
  },
});


export default defineDb({
  tables: {
    User,
    WorkerProfile,
    Role,
    ServiceCategory,
    Service,
    Wallet,
    Transaction,
    HiringService,
    ReviewCompletedWork,
    ReviewWorker,
    Analytic,
    CommentService,
    Follower,
    HiringWorker,
    Conversation,
    ConversationParticipant,
    Message,
    MessageStatus,
  }
})
