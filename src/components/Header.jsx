export default function Header() {
  return (
    <header className="bg-earth-800 text-sand-100 py-10 px-6 md:px-12 relative overflow-hidden">
      {/* Decoraciones */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-sand-300/10" />
      <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full border border-sand-300/10" />
      <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full border border-sand-300/5 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🌍</span>
          <span className="text-sand-400 font-body text-sm tracking-[0.2em] uppercase font-medium">
            Countries Explorer
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black leading-tight text-sand-50">
          Explora el{' '}
          <span className="text-sand-300 italic">mundo</span>
        </h1>
        <p className="mt-3 text-sand-400 font-body text-base max-w-xl">
          Descubre información detallada sobre todos los países del planeta — banderas,
          capitales, poblaciones y mucho más.
        </p>
      </div>
    </header>
  )
}
