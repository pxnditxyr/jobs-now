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
      email: 'pxndxs@qualitysoft.com',
      password: bcryptjs.hashSync( '123456', 10 ),
      role: 'admin',
    },
    {
      id: UUID(),
      name: 'Jhonnael',
      email: 'jhonnael@qualitysoft.com',
      password: bcryptjs.hashSync( '123456', 10 ),
      role: 'worker',
    }
  ]

  await db.insert( Role ).values( roles )
  await db.insert( User ).values( users )
}
