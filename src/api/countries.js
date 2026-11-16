
const BASE_URL = '/countries.json'

let countriesCache = null
let countriesPromise = null

async function loadCountries() {
  if (countriesCache) return countriesCache

  if (!countriesPromise) {
    countriesPromise = fetch(BASE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al obtener países: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('El archivo countries.json no contiene una lista válida')
        }

        countriesCache = data
        return data
      })
      .catch((error) => {
        countriesPromise = null
        throw error
      })
  }

  return countriesPromise
}

export async function fetchAllCountries() {
  const data = await loadCountries()

  return [...data].sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  )
}

export async function fetchCountryByCode(code) {
  const data = await loadCountries()

  const country = data.find(
    (item) =>
      item.cca3?.toLowerCase() === String(code).toLowerCase()
  )

  if (!country) {
    throw new Error(`País no encontrado: ${code}`)
  }

  return country
}

export async function fetchCountriesByCodes(codes) {
  if (!codes || codes.length === 0) return []

  const data = await loadCountries()

  const normalizedCodes = new Set(
    codes.map((code) => String(code).toLowerCase())
  )

  return data.filter((country) =>
    normalizedCodes.has(country.cca3?.toLowerCase())
  )
}
