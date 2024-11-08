

export const getErrorMessage = ( error : any ) : string => {
  const prefix = 'Failed to validate: '
  let errorDetails = []

  if ( error.message.startsWith( prefix ) ) {

    const jsonString = error.message.slice( prefix.length ).trim()

    try {
      errorDetails = JSON.parse( jsonString )
    } catch ( parseError : any ) {
      console.error( 'Error al parsear el mensaje de error:', parseError )
    }
  } else {
    if ( error.code === 'INTERNAL_SERVER_ERROR' ) {
      const tableKey = error.message.split( ':' )[ 2 ].trim()
      const key = tableKey.split( '.' )[ 1 ]
      errorDetails = [ { message: `El ${ key } ya está en uso 🔑` } ]
    } else {
      console.error( 'Formato de mensaje de error inesperado:', error.message )
    }
  }

  const errorMessages = errorDetails.map( ( detail : { message: string } ) => detail.message ).join( ' ' )
  return errorMessages
}
