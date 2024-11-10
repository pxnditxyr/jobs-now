import { db, Role, ServiceCategory, User, Wallet, WorkerProfile } from 'astro:db'
import { seedRoles, seedServiceCategories, seedUsers, seedWallets, seedWorkerProfiles } from './seed-data'

export default async function seed() {
  await db.insert( Role ).values( seedRoles )
  await db.insert( User ).values( seedUsers )
  await db.insert( ServiceCategory ).values( seedServiceCategories )
  await db.insert( WorkerProfile ).values( seedWorkerProfiles )
  await db.insert( Wallet ).values( seedWallets )
}

