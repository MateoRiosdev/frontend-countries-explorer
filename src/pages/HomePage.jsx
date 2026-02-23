import { useState, useMemo, useEffect } from 'react'
import { useCountries } from '../hooks/useCountries'
import CountryCard from '../components/CountryCard'
import CountrySkeleton from '../components/CountrySkeleton'
import SearchBar from '../components/SearchBar'
import ScrollToTopButton from '../components/ScrollToTopButton'

const REGIONS = ['Todos', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic']

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeRegion, setActiveRegion] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)

  const countriesPerPage = 25

  const { data: countries, isLoading, isError, error } = useCountries()

  // 🔎 FILTRADO
  const filtered = useMemo(() => {
    if (!countries) return []

    return countries.filter((c) => {
      const matchesSearch =
        c.name.common.toLowerCase().includes(search.toLowerCase()) ||
        c.name.official.toLowerCase().includes(search.toLowerCase()) ||
        c.capital?.[0]?.toLowerCase().includes(search.toLowerCase())

      const matchesRegion =
        activeRegion === 'Todos' || c.region === activeRegion

      return matchesSearch && matchesRegion
    })
  }, [countries, search, activeRegion])

  // 🔁 Resetear página cuando cambie búsqueda o región
  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeRegion])

  // 📄 PAGINACIÓN
  const totalPages = Math.ceil(filtered.length / countriesPerPage)
  const indexOfLast = currentPage * countriesPerPage
  const indexOfFirst = indexOfLast - countriesPerPage
  const currentCountries = filtered.slice(indexOfFirst, indexOfLast)

  return (
    <div className="min-h-screen">
      
      {/* HEADER */}
      <header className="relative overflow-hidden border-b border-[rgba(212,168,67,0.15)]">
        <div className="relative max-w-7xl mx-auto px-6 py-14 sm:py-20">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Explorador de
            <span className="block mt-2 text-[#d4a843]">Países</span>
          </h1>
          <p className="mt-4 text-slate-400 font-body font-light text-lg max-w-xl">
            Descubre cada nación del mundo con búsqueda en tiempo real.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* REGIONES */}
        <div className="flex flex-wrap gap-2 mb-6">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-1.5 rounded-full text-sm font-body font-medium border transition
              ${activeRegion === region
                ? 'bg-[#d4a843] border-[#d4a843] text-[#04080f]'
                : 'border-[rgba(212,168,67,0.25)] text-slate-400 hover:border-[#d4a843]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <SearchBar
          value={search}
          onChange={setSearch}
          totalCount={countries?.length ?? 0}
          filteredCount={filtered.length}
        />

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
          {isLoading
            ? Array.from({ length: 25 }).map((_, i) => (
                <CountrySkeleton key={i} />
              ))
            : currentCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))
          }
        </div>

        {/* PAGINACIÓN */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border
                ${currentPage === i + 1
                  ? 'bg-[#d4a843] border-[#d4a843] text-[#04080f]'
                  : 'border-[rgba(212,168,67,0.25)] text-slate-400 hover:border-[#d4a843]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-[#0f2044] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#d4a843]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-300 font-display text-xl mb-2">No se encontraron países</p>
            <p className="text-slate-500 font-body text-sm">
              Intenta ajustar la búsqueda o el filtro de región
            </p>
            <button
              onClick={() => { setSearch(''); setActiveRegion('Todos') }}
              className="mt-4 text-[#d4a843] text-sm font-body hover:underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </main>

    {/* Footer */}
    <footer className="border-t border-[rgba(212,168,67,0.1)] py-6 mt-10">
      <p className="text-center text-slate-600 font-body text-sm">
        Datos obtenidos de{' '}
        <a 
          href="https://restcountries.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#d4a843]/70 hover:text-[#d4a843] transition-colors"
        >
          REST Countries API
        </a> 
        {' '}· Explorador de Países — Nivel 1
      </p>
      
    {/* Créditos */}
        <p className="text-center text-slate-500 font-body text-xs mt-1">
          © {new Date().getFullYear()} Mateo Julio Gomero Rios (
          <a 
            href="https://github.com/MateoRiosdev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#C49102] hover:underline transition-all"
          >
            MateoRiosdev.
          </a>
          ) - Todos los derechos reservados
        </p>
      </footer>

      <ScrollToTopButton />
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      <p className="font-body text-xs text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  )
}
