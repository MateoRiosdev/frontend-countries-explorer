
const fs = require('node:fs')
const path = require('node:path')
const countries = require('world-countries')
const ct = require('countries-and-timezones')

async function generateCountries() {
  console.log('Obteniendo datos de población...')

  const url =
    'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=2000&mrnev=1'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Banco Mundial: HTTP ${response.status}`)
  }

  const result = await response.json()

  if (!Array.isArray(result[1])) {
    throw new Error('Respuesta inválida del Banco Mundial')
  }

  const populationMap = new Map()

  for (const record of result[1]) {
    const code = record.countryiso3code

    if (
      !code ||
      code.length !== 3 ||
      typeof record.value !== 'number'
    ) {
      continue
    }

    const year = Number(record.date)
    const previous = populationMap.get(code)

    if (!previous || year > previous.year) {
      populationMap.set(code, {
        population: record.value,
        year
      })
    }
  }

  console.log('Procesando países y zonas horarias...')

  const data = countries.map((country) => {
    const code2 = country.cca2.toLowerCase()

    const populationData = populationMap.get(country.cca3)

    const timezoneData = ct.getCountry(country.cca2)

    const timezones = timezoneData?.timezones || []

    const flags = {
      ...country.flags,
      png: `https://flagcdn.com/w320/${code2}.png`,
      svg: `https://flagcdn.com/${code2}.svg`,
      alt: `Bandera de ${country.name.common}`
    }

    if (country.cca3 === 'AFG') {
      flags.png = '/flags/afghanistan.svg'
      flags.svg = '/flags/afghanistan.svg'
    }

    return {
      ...country,
      flags,
      population: populationData?.population ?? null,
      populationYear: populationData?.year ?? null,
      timezones
    }
  })

  const populatedCount = data.filter(
    (country) => country.population !== null
  ).length

  const timezoneCount = data.filter(
    (country) => country.timezones.length > 0
  ).length

  if (populatedCount < 150 || timezoneCount < 150) {
    throw new Error(
      'Los datos descargados están incompletos. No se reemplazó el JSON.'
    )
  }

  const output = path.join(
    process.cwd(),
    'public',
    'countries.json'
  )

  fs.mkdirSync(path.dirname(output), { recursive: true })

  fs.writeFileSync(
    output,
    JSON.stringify(data, null, 2),
    'utf8'
  )

  console.log('--------------------------------')
  console.log('Países totales:', data.length)
  console.log('Con población:', populatedCount)
  console.log('Con zonas horarias:', timezoneCount)
  console.log('--------------------------------')

  const peru = data.find((country) => country.cca3 === 'PER')
  const afghanistan = data.find((country) => country.cca3 === 'AFG')

  console.log('Perú:', {
    population: peru.population,
    populationYear: peru.populationYear,
    timezones: peru.timezones
  })

  console.log('Afganistán:', {
    population: afghanistan.population,
    populationYear: afghanistan.populationYear,
    timezones: afghanistan.timezones,
    flag: afghanistan.flags.svg
  })

  console.log('countries.json actualizado correctamente')
}

generateCountries().catch((error) => {
  console.error('ERROR:', error.message)
  process.exitCode = 1
})
