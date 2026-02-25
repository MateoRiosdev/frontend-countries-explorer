export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const delta = 2

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium border
          border-[rgba(212,168,67,0.25)] text-slate-400
          hover:border-[#d4a843] hover:text-[#d4a843]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[rgba(212,168,67,0.25)] disabled:hover:text-slate-400
          transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>

      {/* Páginas */}
      <div className="flex items-center gap-1">
        {getPages().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-9 text-center text-slate-600 font-body text-sm">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-body font-medium border transition-all duration-200
                ${currentPage === page
                  ? 'bg-[#d4a843] border-[#d4a843] text-[#04080f] font-bold'
                  : 'border-[rgba(212,168,67,0.2)] text-slate-400 hover:border-[#d4a843] hover:text-[#d4a843]'
                }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium border
          border-[rgba(212,168,67,0.25)] text-slate-400
          hover:border-[#d4a843] hover:text-[#d4a843]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[rgba(212,168,67,0.25)] disabled:hover:text-slate-400
          transition-all duration-200"
      >
        Siguiente
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
