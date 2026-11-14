import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../features/posts/PostCard'
import Navbar from '../components/Navbar'
import ScrollToTopButton from '../components/ScrollToTopButton'
import Pagination from '../components/Pagination'
import { migrateLocalPosts } from '../utils/localPostsUtils'

const PAGE_SIZE = 10

export default function PostsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // ── Estado de posts locales (migra IDs viejos de Date.now() al montar) ──
  const [localPosts, setLocalPosts] = useState(() => {
    try {
      migrateLocalPosts()
      return JSON.parse(localStorage.getItem('local-posts') || '[]')
    } catch { return [] }
  })

  const { data, isLoading, isError, error } = usePosts(page)

  const apiPosts   = data?.data   ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

  // ── FIX 4: Aplicar post-edits a los posts de la API ─────────
  // Los posts editados se guardan en localStorage['post-edits']
  // pero la API siempre devuelve los datos originales. Los fusionamos aquí.
  const apiPostsWithEdits = useMemo(() => {
    try {
      const edits = JSON.parse(localStorage.getItem('post-edits') || '{}')
      if (!Object.keys(edits).length) return apiPosts
      return apiPosts.map(post => {
        const edit = edits[String(post.id)]
        return edit ? { ...post, ...edit } : post
      })
    } catch {
      return apiPosts
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPosts])

  // Posts locales solo en página 1, arriba de la API
  const posts = page === 1 ? [...localPosts, ...apiPostsWithEdits] : apiPostsWithEdits

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    // ── FIX 1: overflow-x-hidden para corregir el responsive ──
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />

      {/* ── Hero ── */}
      <header className="relative overflow-hidden border-b border-[rgba(212,168,67,0.15)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[rgba(212,168,67,0.03)] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[rgba(14,30,80,0.6)] rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-[#d4a843]" />
              <span className="text-[#d4a843] text-xs font-body font-medium tracking-widest uppercase">
                JSONPlaceholder API
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
              Gestor de
              <span className="block text-[#d4a843]">Posts</span>
            </h1>
            <p className="mt-3 text-slate-400 font-body font-light text-base max-w-lg">
              CRUD completo sobre JSONPlaceholder — crea, edita y elimina posts en tiempo real.
            </p>
          </div>

          <Link
            to="/posts/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#d4a843] hover:bg-[#c09535] active:scale-95
              text-[#04080f] font-body font-semibold text-sm rounded-xl transition-all duration-200 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Crear post
          </Link>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <main className="max-w-7xl mx-auto px-6 py-10 overflow-x-hidden">

        {/* Barra de búsqueda + info */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between w-full mb-6">

          {/* Input de búsqueda */}
          <div className="relative w-full sm:w-96">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a843] w-4 h-4 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar posts…"
              className="w-full bg-[#0a1628] border border-[rgba(212,168,67,0.25)] text-slate-200 placeholder-slate-500
                font-body text-sm rounded-xl pl-11 pr-10 py-3
                focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[rgba(212,168,67,0.4)]
                transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#d4a843] transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Info de resultados */}
          {!isLoading && !isError && (
            <p className="text-sm text-slate-500 font-body">
              {search ? (
                <>
                  <span className="text-slate-300 font-medium">{filteredPosts.length}</span>
                  {' '}resultados para{' '}
                  <span className="text-[#d4a843] font-semibold">"{search}"</span>
                </>
              ) : (
                <>
                  Página <span className="text-slate-300 font-medium">{page}</span> de{' '}
                  <span className="text-[#d4a843] font-semibold">{totalPages}</span>
                  {' · '}
                  <span className="text-slate-300 font-medium">{filteredPosts.length}</span>{' '}
                  resultados
                </>
              )}
            </p>
          )}
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
            <p className="text-red-400 font-display text-xl mb-2">Error al cargar posts</p>
            <p className="text-slate-500 font-body text-sm">{error?.message}</p>
          </div>
        )}

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <PostSkeleton key={i} />)}
          </div>
        )}

        {/* Grid de posts */}
        {!isLoading && !isError && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => {
              const localIdx = localPosts.findIndex(p => p.id === post.id)
              // Posts locales: badge = su posición entre los locales (1, 2…)
              // Posts de la API: badge = su ID real, desplazado por los locales
              //   → en pág 1 con N locales: post ID-1 muestra N+1, post ID-2 muestra N+2…
              //   → en pág 2+: no hay locales, el desplazamiento es 0 → muestra ID real
              const localOffset = page === 1 ? localPosts.length : 0
              const displayNumber = localIdx >= 0
                ? localIdx + 1
                : post.id + localOffset
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  localPosts={localPosts}
                  setLocalPosts={setLocalPosts}
                  displayNumber={displayNumber}
                />
              )
            })}
          </div>
        )}

        {/* Estado vacío */}
        {!isLoading && !isError && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-[#0f2044] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#d4a843]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-300 font-display text-xl mb-2">No se encontraron posts</p>
            <p className="text-slate-500 font-body text-sm">
              Intenta ajustar la búsqueda para encontrar lo que estás buscando
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-[#d4a843] text-sm font-body hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Paginación (solo cuando no hay búsqueda activa) */}
        {!search && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        )}
      </main>

      <footer className="border-t border-[rgba(212,168,67,0.1)] py-6 mt-10">
        <p className="text-center text-slate-600 font-body text-sm">
          Datos de{' '}
          <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noopener noreferrer"
            className="text-[#d4a843]/70 hover:text-[#d4a843] transition-colors">
            JSONPlaceholder API
          </a>
          {' '}· Explorador de Países — Nivel 3
        </p>
        <p className="text-center text-slate-500 font-body text-xs mt-1">
          © {new Date().getFullYear()} Mateo Julio Gomero Rios (
          <a href="https://github.com/MateoRiosdev" target="_blank" rel="noopener noreferrer"
            className="text-[#C49102] hover:underline">
            MateoRiosdev.
          </a>
          ) - Todos los derechos reservados
        </p>
      </footer>

      <ScrollToTopButton />
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.08)] rounded-2xl p-5 space-y-4">
      <div className="shimmer h-7 w-7 rounded-lg" />
      <div className="shimmer h-5 w-4/5 rounded-lg" />
      <div className="shimmer h-4 w-full rounded" />
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-4 w-1/2 rounded" />
    </div>
  )
}
