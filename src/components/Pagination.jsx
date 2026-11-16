
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null

  const getPages = (delta) => {
    const pages = []

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

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const navButtonClass = `
    flex items-center justify-center gap-1.5
    px-3 py-2 rounded-lg text-sm font-body font-medium border
    border-[rgba(212,168,67,0.25)] text-slate-400
    hover:border-[#d4a843] hover:text-[#d4a843]
    disabled:opacity-30 disabled:cursor-not-allowed
    disabled:hover:border-[rgba(212,168,67,0.25)]
    disabled:hover:text-slate-400
    transition-all duration-200
  `

  const renderPageButtons = (delta) =>
    getPages(delta).map((page, idx) =>
      page === '...' ? (
        <span
          key={`ellipsis-${idx}`}
          className="w-5 sm:w-8 text-center text-slate-600 font-body text-sm"
        >
          …
        </span>
      ) : (
        <button
          key={page}
          type="button"
          onClick={() => changePage(page)}
          aria-label={`Ir a la página ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
          className={`w-9 h-9 shrink-0 rounded-lg text-sm font-body
            font-medium border transition-all duration-200
            ${
              currentPage === page
                ? 'bg-[#d4a843] border-[#d4a843] text-[#04080f] font-bold'
                : 'border-[rgba(212,168,67,0.2)] text-slate-400 hover:border-[#d4a843] hover:text-[#d4a843]'
            }`}
        >
          {page}
        </button>
      )
    )

  return (
    <nav
      aria-label="Paginación de países"
      className="mt-10 w-full max-w-full px-2"
    >
      {/* MÓVIL: navegación en dos filas */}
      <div className="flex flex-col items-center gap-3 sm:hidden">
        <div className="flex w-full max-w-sm items-center gap-2">
          <button
            type="button"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${navButtonClass} flex-1 min-w-0`}
          >
            <span aria-hidden="true">‹</span>
            Anterior
          </button>

          <button
            type="button"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${navButtonClass} flex-1 min-w-0`}
          >
            Siguiente
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="flex max-w-full items-center justify-center gap-1">
          {renderPageButtons(0)}
        </div>

        <p className="text-xs text-slate-500 font-body">
          Página {currentPage} de {totalPages}
        </p>
      </div>

      {/* TABLET Y PC: navegación horizontal */}
      <div className="hidden sm:flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={navButtonClass}
        >
          <span aria-hidden="true">‹</span>
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {renderPageButtons(2)}
        </div>

        <button
          type="button"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={navButtonClass}
        >
          Siguiente
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </nav>
  )
}
