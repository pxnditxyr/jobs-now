import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

export const signupUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min( 6 ),
    confirmPassword: z.string().min( 6 ),
    typeOfUser: z.string().optional(),
  }),
  handler: async () => {
    return {
      success: true,
    }
  }
})
