function formatPopulation(pop) {
  if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1) + 'B'
  if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + 'M'
  if (pop >= 1_000) return (pop / 1_000).toFixed(0) + 'K'
  return pop.toString()
}

function getLanguages(languages) {
  if (!languages) return 'N/D'
  return Object.values(languages).slice(0, 2).join(', ')
}

export default function CountryCard({ country }) {
  const { name, flags, capital, population, region, subregion, languages } = country

  return (
    <article className="card-hover bg-[#0a1628] border gold-border rounded-2xl overflow-hidden cursor-pointer group">
      {/* Banderas */}
      <div className="relative h-44 overflow-hidden bg-[#0f2044]">
        <img
          src={flags?.svg || flags?.png}
          alt={flags?.alt || `Bandera de ${name.common}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Superposición de degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />

        {/* Insignia de la región */}
        <span className="absolute top-3 right-3 bg-[#0a1628]/80 backdrop-blur-sm text-[#d4a843] text-xs font-body font-medium px-2.5 py-1 rounded-full border border-[rgba(212,168,67,0.3)]">
          {region}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h2 className="font-display text-lg font-semibold text-white leading-tight mb-1 group-hover:text-[#d4a843] transition-colors duration-200">
          {name.common}
        </h2>
        {name.official !== name.common && (
          <p className="text-slate-500 text-xs font-body mb-3 truncate" title={name.official}>
            {name.official}
          </p>
        )}

        <div className="border-t border-[rgba(212,168,67,0.1)] pt-3 mt-3 space-y-1.5">
          <InfoRow label="Capital" value={capital?.[0] || 'N/D'} />
          <InfoRow label="Población" value={formatPopulation(population)} />
          {subregion && <InfoRow label="Subregión" value={subregion} />}
          <InfoRow label="Idioma" value={getLanguages(languages)} />
        </div>
      </div>
    </article>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500 font-body font-light">{label}</span>
      <span className="text-slate-300 font-body font-medium text-right max-w-[60%] truncate" title={value}>
        {value}
      </span>
    </div>
  )
}
