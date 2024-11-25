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

const Hiring = defineTable({
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
    state: column.text({ default: 'pending' }),

    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
    status: column.boolean({ default: true }),
  }
})

const Review = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    hiringId: column.text({ references: () => Hiring.columns.id }),
    rating: column.number(),
    comment: column.text(),

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
    rating: column.number(),
    comment: column.text(),

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

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    WorkerProfile,
    Role,
    ServiceCategory,
    Service,
    Wallet,
    Transaction,
    Hiring,
    Review,
    ReviewWorker,
    Analytic,
    CommentService,
    Follower,
    HiringWorker,
  }
});
