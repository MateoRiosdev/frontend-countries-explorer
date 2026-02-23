export default function SearchBar({ value, onChange, totalCount, filteredCount }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        {/* Search icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a843] w-4 h-4 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar países…"
          className="w-full bg-[#0a1628] border border-[rgba(212,168,67,0.25)] text-slate-200 placeholder-slate-500
                     font-body text-sm rounded-xl pl-11 pr-10 py-3
                     focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[rgba(212,168,67,0.4)]
                     transition-all duration-200"
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#d4a843] transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

                {/* Info de página */}
        {!isLoading && !isError && filtered.length > 0 && (
          <p className="text-xs text-slate-500 font-body mb-4">
            Página <span className="text-slate-300 font-medium">{currentPage}</span> de{' '}
            <span className="text-[#d4a843] font-semibold">{totalPages}</span>
            {' · '}mostrando{' '}
            <span className="text-slate-300 font-medium">{paginated.length}</span> de{' '}
            <span className="text-[#d4a843] font-semibold">{filtered.length}</span> países
          </p>
        )}

    </div>
  )
}
