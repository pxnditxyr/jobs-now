
export const formatGender = ( gender : string ) => {

  const genderValues : Record<string, string> = {
    'male': 'Masculino',
    'female': 'Femenino',
    'other': 'Otro',
  }
  return genderValues[ gender ] || 'No especificado'
}
