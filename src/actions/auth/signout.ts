import { defineAction } from 'astro:actions'

export const signoutUser = defineAction({
  accept: 'json',
  handler: async ( _, { cookies } ) => {
    return {
      success: true,
    }
  }
})
