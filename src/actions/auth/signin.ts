import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

export const signinUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min( 1 ),
  }),
  handler: async ( { email, password }, { cookies } ) => {
    return {
      success: true,
    }
  }
})
