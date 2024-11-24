import { defineAction } from 'astro:actions'
import { db, User, Wallet, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'
import bcryptjs from 'bcryptjs'


export const createUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string({ message: '👤 El nombre es requerido.' }).min( 2, { message: '👤 El nombre debe tener al menos 2 caracteres.' } ),
    lastName: z.string({ message: '👥 El apellido es requerido' }).min( 2, { message: '👥 El apellido debe tener al menos 2 caracteres.' } ),
    email: z.string({ message: '📧 El correo electrónico es requerido.' }).email( { message: '📧 El correo electrónico debe ser válido.' } ),
    password: z.string({ message: '🔒 La contraseña es requerida.' }).min( 6, { message: '🔒 La contraseña debe tener al menos 6 caracteres.' } ),
    confirmPassword: z.string({ message: '🔑 La confirmación de la contraseña es requerida.' }),

    gender: z.string().optional(),
    birthDate: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),

    roleId: z.string({ message: '👤 El rol es requerido.' }),
  }).refine( ( { password, confirmPassword } ) => {
    return password === confirmPassword
  }, {
      message: '🔑 La confirmación de la contraseña debe ser igual a la contraseña.',
      path: [ 'confirmPassword' ],
  } ) ,
  handler: async ( {
    name,
    email,
    lastName,
    password,
    gender,
    birthDate,
    phone,
    address,
    roleId,
  } ) => {


    try {
      const id = UUID()

      await db.insert( User ).values({
        id,
        name,
        lastName,
        email: email.toLowerCase().trim(),
        password: bcryptjs.hashSync( password, 10 ),

        gender,
        birthDate,
        phone,
        address,

        roleId,
        createdAt: new Date(),
      })

      await db.insert( Wallet ).values({
        id: UUID(),
        userId: id,
        createdAt: new Date(),
      })

      if ( roleId === 'worker' ) {
        await db.insert( WorkerProfile ).values({
          id: UUID(),
          userId: id,
          createdAt: new Date(),
        })
      }

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
