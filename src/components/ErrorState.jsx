export default function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="text-6xl mb-6">🌐</div>
      <h2 className="font-display text-2xl font-bold text-earth-800 mb-2">
        Error al cargar los países
      </h2>
      <p className="text-sand-500 font-body max-w-sm">
        {message ?? 'Algo salió mal al conectar con la API. Intenta recargar la página.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-2.5 bg-earth-800 text-sand-100 rounded-xl font-body font-medium hover:bg-earth-700 transition"
      >
        Reintentar
      </button>
    </div>
  )
}
