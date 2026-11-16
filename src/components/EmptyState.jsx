export default function EmptyState({ search, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center col-span-full">
      <div className="text-6xl mb-6">🔍</div>
      <h2 className="font-display text-2xl font-bold text-earth-800 mb-2">
        Sin resultados
      </h2>
      <p className="text-sand-500 font-body max-w-xs">
        No se encontraron países que coincidan con{' '}
        <span className="font-semibold text-earth-700">"{search}"</span>.
      </p>
      <button
        onClick={onClear}
        className="mt-5 px-5 py-2.5 bg-terracotta-500 text-white rounded-xl font-body font-medium hover:bg-terracotta-600 transition"
      >
        Limpiar búsqueda
      </button>
    </div>
  )
}
