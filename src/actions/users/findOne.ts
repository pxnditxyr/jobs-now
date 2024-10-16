import { defineAction } from "astro:actions";
import { db, DisasterType, eq } from "astro:db";

export const findOneDisasterType = defineAction({
  accept: 'json',
  handler: async ({ id }) => {
    const [ disasterType ] = await db
      .select()
      .from( DisasterType )
      .where( eq( DisasterType.id, id ) )

    if ( !disasterType )
      throw new Error( 'Parece que el desastre no existe' )

    return {
      disasterType
    }
  }
})
