import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCountryDetail, useBorderCountries } from '../hooks/useCountryDetail'
import CommentsSection from '../components/CommentsSection'
import ScrollToTopButton from '../components/ScrollToTopButton'

function formatNumber(n) {
  if (!n) return 'N/D'
  return n.toLocaleString('es-PE')
}

function formatArea(area) {
  if (!area) return 'N/D'
  return `${area.toLocaleString('es-PE')} km²`
}

function getCurrencies(currencies) {
  if (!currencies) return 'N/D'
  return Object.values(currencies)
    .map(c => `${c.name} (${c.symbol || '?'})`)
    .join(', ')
}

function getLanguages(languages) {
  if (!languages) return 'N/D'
  return Object.values(languages).join(', ')
}

export default function CountryDetailPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { data: country, isLoading, isError, error } = useCountryDetail(code)
  const { data: borderCountries } = useBorderCountries(country?.borders)

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    return (
      <div className="min-h-screen bg-[#04080f] flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p className="font-display text-2xl text-red-400 mb-2">País no encontrado</p>
        <p className="text-slate-500 font-body text-sm mb-6">{error?.message}</p>
        <button onClick={() => navigate('/')} className="btn-gold">← Volver al inicio</button>
      </div>
    )
  }

  const {
    name, flags, capital, population, region, subregion,
    languages, currencies, area, timezones, continents,
    tld, maps, unMember, independent,
  } = country

  return (
    <div className="min-h-screen bg-[#04080f]">
      {/* Nav */}
      <nav className="border-b border-[rgba(212,168,67,0.12)] bg-[#0a1628]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#d4a843] font-body text-sm transition-colors duration-200 group"
          >
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <span className="text-[#d4a843] text-xs font-body font-medium tracking-widest uppercase">
            REST Countries API
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[rgba(212,168,67,0.15)] aspect-video">
            <img
              src={flags?.svg || flags?.png}
              alt={flags?.alt || `Bandera de ${name.common}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-6 bg-[#d4a843]" />
                <span className="text-[#d4a843] text-xs font-body tracking-widest uppercase">
                  {continents?.[0] || region}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                {name.common}
              </h1>
              {name.official !== name.common && (
                <p className="text-slate-500 font-body text-sm mt-1 italic">{name.official}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {unMember && <Badge color="blue">ONU</Badge>}
                {independent && <Badge color="green">Independiente</Badge>}
                {tld?.[0] && <Badge color="amber">Dominio: {tld[0]}</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DataCard icon="🏙️" label="Capital" value={capital?.[0] || 'N/D'} />
              <DataCard icon="👥" label="Población" value={formatNumber(population)} />
              <DataCard icon="🌍" label="Región" value={region} />
              <DataCard icon="📍" label="Subregión" value={subregion || 'N/D'} />
              <DataCard icon="📐" label="Área" value={formatArea(area)} />
              <DataCard icon="💰" label="Moneda" value={getCurrencies(currencies)} />
            </div>

            {maps?.googleMaps && (
              <a
                href={maps.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-body font-medium text-[#d4a843]/70
                  hover:text-[#d4a843] border border-[rgba(212,168,67,0.25)] hover:border-[#d4a843]
                  rounded-xl px-4 py-2 transition-all duration-200"
              >
                Ver en Google Maps
              </a>
            )}
          </div>
        </div>

        {/* Datos adicionales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoBlock title="Idiomas oficiales" icon="🗣️">
            <p className="text-slate-300 font-body text-sm leading-relaxed">{getLanguages(languages)}</p>
          </InfoBlock>
          <InfoBlock title="Zonas horarias" icon="🕐">
            <div className="flex flex-wrap gap-2">
              {timezones?.slice(0, 6).map(tz => (
                <span key={tz} className="text-xs bg-[#0f2044] text-slate-400 px-2.5 py-1 rounded-lg font-body border border-[rgba(212,168,67,0.1)]">
                  {tz}
                </span>
              ))}
              {timezones?.length > 6 && (
                <span className="text-xs text-slate-600 font-body self-center">+{timezones.length - 6} más</span>
              )}
            </div>
          </InfoBlock>
        </div>

        {/* Países fronterizos */}
        {country?.borders?.length > 0 && borderCountries?.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>🗺️</span> Países fronterizos
            </h2>
            <div className="flex flex-wrap gap-3">
              {borderCountries.map(b => (
                <Link
                  key={b.cca3}
                  to={`/country/${b.cca3}`}
                  className="flex items-center gap-2 bg-[#0a1628] border border-[rgba(212,168,67,0.2)]
                    hover:border-[#d4a843] rounded-xl px-4 py-2 transition-all duration-200 group"
                >
                  <img
                    src={b.flags?.svg || b.flags?.png}
                    alt={`Bandera de ${b.name?.common}`}
                    className="w-8 h-5 object-cover rounded"
                  />
                  <span className="text-slate-300 group-hover:text-[#d4a843] font-body text-sm font-medium transition-colors duration-200">
                    {b.name?.common}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <CommentsSection countryCode={code} countryName={name.common} />

      </main>

      <footer className="border-t border-[rgba(212,168,67,0.1)] py-6 mt-10">
        <p className="text-center text-slate-600 font-body text-sm">
          Datos obtenidos de <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" className="text-[#d4a843]/70 hover:text-[#d4a843] transition-colors">REST Countries API</a>
          {' '}· Explorador de Países — Nivel 2
        </p>
        <p className="text-center text-slate-500 font-body text-xs mt-1">
          © {new Date().getFullYear()} Mateo Julio Gomero Rios (
          <a href="https://github.com/MateoRiosdev" target="_blank" rel="noopener noreferrer" className="text-[#C49102] hover:underline transition-all">
            MateoRiosdev
          </a>) - Todos los derechos reservados
        </p>
      </footer>

      <ScrollToTopButton />
    </div>
  )
}

// ── Sub-componentes ─────────────────────────────────────────────
function Badge({ children, color }) {
  const colors = {
    blue: 'bg-blue-900/30 text-blue-400 border-blue-700/40',
    green: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/40',
    amber: 'bg-amber-900/30 text-amber-400 border-amber-700/40',
  }
  return <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full border ${colors[color]}`}>{children}</span>
}

function DataCard({ icon, label, value }) {
  return (
    <div className="bg-[#0f2044] rounded-xl p-3.5 border border-[rgba(212,168,67,0.08)]">
      <p className="text-slate-500 text-xs font-body mb-1 flex items-center gap-1.5"><span>{icon}</span>{label}</p>
      <p className="text-slate-200 font-body font-medium text-sm truncate" title={value}>{value}</p>
    </div>
  )
}

function InfoBlock({ title, icon, children }) {
  return (
    <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.15)] rounded-2xl p-5">
      <h3 className="font-display text-base font-semibold text-white mb-3 flex items-center gap-2"><span>{icon}</span>{title}</h3>
      {children}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#04080f]">
      <div className="border-b border-[rgba(212,168,67,0.12)] bg-[#0a1628]/80 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="shimmer h-5 w-20 rounded-lg" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="shimmer rounded-2xl aspect-video" />
          <div className="space-y-4">
            <div className="shimmer h-10 w-3/4 rounded-xl" />
            <div className="shimmer h-5 w-1/2 rounded-lg" />
            <div className="grid grid-cols-2 gap-3 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shimmer h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}