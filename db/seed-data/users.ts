import { v4 as UUID } from 'uuid'
import bcryptjs from 'bcryptjs'

export const seedUsers = [
  {
    id: '5b9c45b3-569a-4a9c-94dd-f2dded6632dc',
    name: 'Administrador',
    lastName: 'Ap',
    email: 'admin@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    roleId: 'admin',
  },
  {
    id: 'f81f4f9e-f662-4814-9405-b4455a13588d',
    name: 'Trabajador',
    lastName: 'Ap',
    email: 'trabajador@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    roleId: 'worker',
  },
  {
    id: 'f4b6d895-01f3-45ed-9cce-588310f27450',
    name: 'Cliente',
    lastName: 'Ap',
    email: 'cliente@jobsnow.com',
    password: bcryptjs.hashSync( '123456', 10 ),
    roleId: 'client',
  },
]

export const seedWorkerProfiles = [
  {
    id: UUID(),
    userId: seedUsers[ 1 ].id,
    description: 'Worker Description',
  }
]

export const seedWallets = [
  {
    id: UUID(),
    userId: seedUsers[ 2 ].id,
  }
]
