
export const formatDate = ( date: Date | string ) => {
  if ( typeof date === 'string' ) {
    const dateObj = new Date( date + 'T00:00:00' )
    return dateObj.toLocaleDateString( 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' } )
  }

  return date.toLocaleDateString( 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' } )
}

export const formatDateTime = ( date: Date | string ) => {
  if ( typeof date === 'string' ) {
    const dateObj = new Date( date + 'T00:00:00' )
    return dateObj.toLocaleDateString( 'es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' } )
  }

  return date.toLocaleDateString( 'es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' } )
}
