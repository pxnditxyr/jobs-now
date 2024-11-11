import type { IErrorDetail } from '@/interfaces'


export const getErrorMessage = ( error : any ) : string => {
  const errorMessages = getErrorList( error ).map( ( detail : IErrorDetail ) => detail.message ).join( '\n' )

  return errorMessages
}

export const getListErrorMessage = ( error : any ) : string[] => {

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

  const errorMessages = errorDetails.map( ( detail : { message: string } ) => detail.message )
  return errorMessages

}

export const getErrorList = ( error : any ) : IErrorDetail[] => {
  console.log( 'error:', error )
  console.log( 'error.message:', error.message )
  if ( error.message.startsWith( 'Failed to validate: ' ) ) {
    const prefix = 'Failed to validate: '
    const textErrors = error.message
    const textErrorsWithoutPrefix = textErrors.slice( prefix.length ).trim()
    const errorList = JSON.parse( textErrorsWithoutPrefix )

    const errorDetails = errorList.map( ( detail : any ) => ( {
      field: detail.path[ 0 ],
      message: detail.message,
    } ) )

    return errorDetails
  }

  if ( error.message.startsWith( 'LibsqlError: SQLITE_CONSTRAINT_UNIQUE:' ) ) {
    const message = error.message
    const field = message.split( ':' )[ 3 ].trim().split( '.' )[ 1 ]
    const errorDetails = [ { field, message: `El ${ field } ya está en uso 🔑` } ]
    return errorDetails
  }

  return [ { field: 'default', message: error.message } ]
}
