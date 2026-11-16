const BASE_URL = 'https://restcountries.com/v3.1'

export async function fetchAllCountries() {
  const fields = 'name,flags,capital,population,region,subregion,languages,cca3'
  const response = await fetch(`${BASE_URL}/all?fields=${fields}`)
  if (!response.ok) throw new Error(`Error al obtener países: ${response.status}`)
  const data = await response.json()
  return data.sort((a, b) => a.name.common.localeCompare(b.name.common))
}

export async function fetchCountryByCode(code) {
  const fields = 'name,flags,capital,population,region,subregion,languages,cca3,currencies,borders,area,timezones,continents,coatOfArms,maps,tld,independent,status,unMember'
  const response = await fetch(`${BASE_URL}/alpha/${code}?fields=${fields}`)
  if (!response.ok) throw new Error(`País no encontrado: ${response.status}`)
  const data = await response.json()
  return data
}

export async function fetchCountriesByCodes(codes) {
  if (!codes || codes.length === 0) return []
  const joined = codes.join(',')
  const response = await fetch(`${BASE_URL}/alpha?codes=${joined}&fields=name,flags,cca3`)
  if (!response.ok) return []
  return response.json()
}
