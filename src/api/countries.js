const BASE_URL = 'https://restcountries.com/v3.1'

export async function fetchAllCountries() {
  const fields = 'name,flags,capital,population,region,subregion,languages,cca3'
  const response = await fetch(`${BASE_URL}/all?fields=${fields}`)

  if (!response.ok) {
    throw new Error(`Error fetching countries: ${response.status}`)
  }

  const data = await response.json()
  return data.sort((a, b) => a.name.common.localeCompare(b.name.common))
}
