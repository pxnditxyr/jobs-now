import { defineAction } from 'astro:actions'
import { db, eq, User } from 'astro:db'
import { z } from 'astro:schema'

export const updateProfile = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string({ message: '👤 El nombre es requerido.' }).min( 2, { message: '👤 El nombre debe tener al menos 2 caracteres.' } ),
    lastName: z.string({ message: '👥 El apellido es requerido' }).min( 2, { message: '👥 El apellido debe tener al menos 2 caracteres.' } ),
    gender: z.string({ message: '👥 El género es requerido' }) .optional(),
    birthDate: z.string({ message: '👥 La fecha de nacimiento es requerida' }).optional(),
    phone: z.string({ message: '👥 El teléfono es requerido' }).optional(),
    address: z.string({ message: '👥 La dirección es requerida' }).optional(),
    avatar: z.string({ message: '👥 El avatar es requerido' }).optional(),

    id: z.string({ message: '👤 El id es requerido.' }),
  }),
  handler: async ({ name, lastName, gender, birthDate, phone, address, avatar, id }) => {
    try {
      await db.update( User ).set({
        name,
        lastName,
        gender,
        birthDate,
        phone,
        address,
        avatar,
      }).where(
        eq( User.id, id )
      )

      return {
        success: true
      }
    } catch ( error : any ) {
      throw new Error( error )
    }
  },
})
