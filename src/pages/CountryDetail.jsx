import { useParams, useNavigate } from 'react-router-dom'
import { useCountries } from '../hooks/useCountries'

export default function CountryDetail() {
  const { cca3 } = useParams()
  const { data: countries, isLoading } = useCountries()
  const navigate = useNavigate()

  if (isLoading) return <p className="text-white text-center mt-10">Cargando...</p>

  const country = countries.find(c => c.cca3 === cca3)
  if (!country) return <p className="text-white text-center mt-10">País no encontrado</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-[#d4a843] rounded text-[#04080f]"
      >
        ← Volver
      </button>

      <h1 className="text-3xl font-bold mb-4 text-white">{country.name.common}</h1>
      <img src={country.flags.svg} alt={country.name.common} className="w-64 mb-4" />

      <p className="text-white"><strong>Región:</strong> {country.region}</p>
      <p className="text-white"><strong>Capital:</strong> {country.capital?.[0]}</p>
      <p className="text-white"><strong>Población:</strong> {country.population.toLocaleString()}</p>
      <p className="text-white"><strong>Subregión:</strong> {country.subregion}</p>
      <p className="text-white"><strong>Idiomas:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/D'}</p>
    </div>
  )
}