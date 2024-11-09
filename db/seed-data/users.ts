import { v4 as UUID } from 'uuid'
import bcryptjs from 'bcryptjs'

export const seedUsers = [
  {
    id: UUID(),
    name: 'Pxndxs 🐼',
    lastName: 'Ricaldi',
    email: 'pxndxs@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    role: 'admin',
  },
  {
    id: UUID(),
    name: 'Admin',
    lastName: 'Administrador',
    email: 'admin@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    role: 'admin',
  },
  {
    id: UUID(),
    name: 'Worker',
    lastName: 'Worker Last Name',
    email: 'worker@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    role: 'worker',
  },
  {
    id: UUID(),
    name: 'User',
    lastName: 'User Last Name',
    email: 'user@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    role: 'client',
  },
]

export const seedWorkerProfiles = [
  {
    id: UUID(),
    userId: seedUsers[ 2 ].id,
    description: 'Worker Description',
  }
]
