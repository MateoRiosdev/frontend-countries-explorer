import { useState, useMemo } from 'react'
import { useCountries } from '../hooks/useCountries'
import CountryCard from '../components/CountryCard'
import CountrySkeleton from '../components/CountrySkeleton'
import SearchBar from '../components/SearchBar'

const REGIONS = ['Todos', 'Africa', 'América', 'Asia', 'Europe', 'Oceanía', 'Antártida']

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeRegion, setActiveRegion] = useState('Todos')

  const { data: countries, isLoading, isError, error } = useCountries()

  const filtered = useMemo(() => {
    if (!countries) return []
    return countries.filter((c) => {
      const matchesSearch =
        c.name.common.toLowerCase().includes(search.toLowerCase()) ||
        c.name.official.toLowerCase().includes(search.toLowerCase()) ||
        c.capital?.[0]?.toLowerCase().includes(search.toLowerCase())

      const matchesRegion = activeRegion === 'Todos' || c.region === activeRegion

      return matchesSearch && matchesRegion
    })
  }, [countries, search, activeRegion])

  return (
    <div className="min-h-screen">
      {/* Header  */}
      <header className="relative overflow-hidden border-b border-[rgba(212,168,67,0.15)]">
        {/* Fondo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(255, 255, 254, 0.04)] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[rgba(14,30,80,0.8)] rounded-full blur-2xl" />
          {/* Cuadricula */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4a843" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-14 sm:py-20">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#d4a843]" />
            <span className="text-[#d4a843] text-xs font-body font-medium tracking-widest uppercase">
              REST Countries API
            </span>
          </div>
        
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Explorador de 
            <span className="block mt-2 text-[#d4a843]">
              Países
            </span>
          </h1>


          <p className="mt-4 text-slate-400 font-body font-light text-lg max-w-xl leading-relaxed">
            Descubre cada nación del mundo — ordenadas alfabéticamente, con búsqueda
            en tiempo real y presentadas de forma elegante.
          </p>

          {/* Estadísticas */}
          {countries && (
            <div className="flex gap-8 mt-8">
              <Stat value={countries.length} label="Países" />
              <Stat value={REGIONS.length - 1} label="Regiones" />
            </div>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Regiones */}
        <div className="flex flex-wrap gap-2 mb-6">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-1.5 rounded-full text-sm font-body font-medium border transition-all duration-200
                ${activeRegion === region
                  ? 'bg-[#d4a843] border-[#d4a843] text-[#04080f]'
                  : 'bg-transparent border-[rgba(212,168,67,0.25)] text-slate-400 hover:border-[#d4a843] hover:text-[#d4a843]'
                }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            totalCount={countries?.length ?? 0}
            filteredCount={filtered.length}
          />
        </div>

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-red-400 font-display text-xl mb-2">Algo salió mal</p>
            <p className="text-slate-500 font-body text-sm">{error?.message}</p>
          </div>
        )}

        {/* Red */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <CountrySkeleton key={i} />)
            : filtered.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))
          }
        </div>

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
