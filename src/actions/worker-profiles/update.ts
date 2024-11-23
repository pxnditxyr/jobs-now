import { defineAction } from 'astro:actions'
import { db, eq, WorkerProfile } from 'astro:db'
import { z } from 'astro:schema'


export const updateWorkerProfile = defineAction({
  accept: 'form',
  input: z.object({
    description:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),
    dni:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),
    portfolio:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),
    education:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),
    experience:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),
    skills:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),
    interests:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),
    about:z.string({ message: 'El dato debe ser una cadena de texto' }).optional(),

    id: z.string({ message: '👤 El id es requerido.' }),
  }),
  handler: async ( {
    id,
    description,
    dni,
    portfolio,
    education,
    experience,
    skills,
    interests,
    about,
  } ) => {
    try {
      await db.update( WorkerProfile ).set({
        description,
        dni,
        portfolio,
        education,
        experience,
        skills,
        interests,
        about,
      }).where(
        eq( WorkerProfile.id, id )
      )

      return {
        success: true,
      }
    } catch ( error : any ) {
      throw new Error( error )
    }
  }
})
