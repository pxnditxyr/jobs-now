import { defineAction } from 'astro:actions'
import { db, User, Wallet, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'
import bcryptjs from 'bcryptjs'

export const signupUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min( 2, { message: '👤 El nombre debe tener al menos 2 caracteres.' } ),
    lastName: z.string().min( 2, { message: '👥 El apellido debe tener al menos 2 caracteres.' } ),
    email: z.string().email( { message: '📧 El correo electrónico debe ser válido.' } ),
    password: z.string().min( 6, { message: '🔒 La contraseña debe tener al menos 6 caracteres.' } ),
    confirmPassword: z.string(),
    typeOfUser: z.boolean().optional(),
  }).refine( ( { password, confirmPassword } ) => {
    return password === confirmPassword
  }, {
      message: '🔑 La confirmación de la contraseña debe ser igual a la contraseña.',
      path: [ 'confirmPassword' ],
  }) ,
  handler: async ( { name, email, lastName, password, typeOfUser } ) => {
    const roleId = typeOfUser ? 'worker' : 'client'

    try {
      const id = UUID()
      await db.insert( User ).values({
        id,
        name,
        lastName,
        email: email.toLowerCase().trim(),
        password: bcryptjs.hashSync( password, 10 ),

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
    } catch ( error : any ) {
      console.error( error )
      throw new Error( error )
    }

    return {
      success: true,
    }
  }
})
