import { v4 as UUID } from 'uuid'
import bcryptjs from 'bcryptjs'

export const seedUsers = [
  {
    id: UUID(),
    name: 'Admin',
    lastName: 'Administrador',
    email: 'admin@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    roleId: 'admin',
  },
  {
    id: UUID(),
    name: 'Worker',
    lastName: 'Worker Last Name',
    email: 'worker@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    roleId: 'worker',
  },
  {
    id: UUID(),
    name: 'Client',
    lastName: 'Client Last Name',
    email: 'client@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    roleId: 'client',
  },
]

export const seedWorkerProfiles = [
  {
    id: UUID(),
    userId: seedUsers[ 2 ].id,
    description: 'Worker Description',
  }
]

export const seedWallets = [
  {
    id: UUID(),
    userId: seedUsers[ 3 ].id,
  }
]
