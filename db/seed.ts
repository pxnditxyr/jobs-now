import { db, Role, User } from 'astro:db'
import { v4 as UUID } from 'uuid'
import bcryptjs from 'bcryptjs'

// https://astro.build/db/seed
export default async function seed() {
	const roles = [
    { id: 'admin', name: 'Administrador' },
    { id: 'worker', name: 'Trabajador' },
    { id: 'user', name: 'Usuario' }
  ]

  const users = [
    {
      id: UUID(),
      name: 'Pxndxs 🐼',
      lastName: 'Ricaldi',
      email: 'pxndxs@qualitysoft.com',
      password: bcryptjs.hashSync( '123456', 10 ),
      role: 'admin',
    },
    {
      id: UUID(),
      name: 'Admin',
      lastName: 'Administrador',
      email: 'admin@qualitysoft.com',
      password: bcryptjs.hashSync( '123456', 10 ),
      role: 'admin',
    },
    {
      id: UUID(),
      name: 'Worker',
      lastName: 'Worker Last Name',
      email: 'worker@qualitysoft.com',
      password: bcryptjs.hashSync( '123456', 10 ),
      role: 'worker',
    },
    {
      id: UUID(),
      name: 'User',
      lastName: 'User Last Name',
      email: 'user@qualitysoft.com',
      password: bcryptjs.hashSync( '123456', 10 ),
      role: 'user',
    },
  ]

  await db.insert( Role ).values( roles )
  await db.insert( User ).values( users )
}
