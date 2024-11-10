import { defineAction } from 'astro:actions'
import { db, eq, User } from 'astro:db'
import { z } from 'astro:schema'
import { v4 as UUID } from 'uuid'


export const updateUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string({ message: '👤 El nombre es requerido.' }).min( 2, { message: '👤 El nombre debe tener al menos 2 caracteres.' } ),
    lastName: z.string({ message: '👥 El apellido es requerido' }).min( 2, { message: '👥 El apellido debe tener al menos 2 caracteres.' } ),
    email: z.string({ message: '📧 El correo electrónico es requerido.' }).email( { message: '📧 El correo electrónico debe ser válido.' } ),
    gender: z.string().optional(),
    birthDate: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),

    roleId: z.string({ message: '👤 El rol es requerido.' }),
    id: z.string({ message: '👤 El id es requerido.' }),
  }),
  handler: async ( {
    id,
    name,
    email,
    lastName,
    gender,
    birthDate,
    phone,
    address,
    roleId,
  } ) => {


    try {
      await db.update( User ).set({
        id: UUID(),
        name,
        lastName,
        email,
        gender,
        birthDate,
        phone,
        address,

        roleId,
      }).where(
        eq( User.id, id )
      )

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }

  }
})
