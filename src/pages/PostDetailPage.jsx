import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePost } from '../hooks/usePost'
import { usePostComments } from '../hooks/usePostComments'
import { useDeletePost } from '../hooks/useDeletePost'
import { useCreateComment } from '../hooks/useCreateComment'
import { useToast } from '../context/ToastContext'
import Modal from '../components/ui/Modal'
import Navbar from '../components/Navbar'
import ScrollToTopButton from '../components/ScrollToTopButton'

const commentSchema = z.object({
  name:  z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  body:  z.string().min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
})

// ── Clave de localStorage para comentarios de un post ─────────
const commentKey = (id) => `post-comments-${id}`

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [showConfirm, setShowConfirm] = useState(false)

  // ── FIX 3: Cargar comentarios locales desde localStorage ────
  const [localComments, setLocalComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem(commentKey(id)) || '[]') } catch { return [] }
  })

  const { data: post, isLoading: loadingPost, isError } = usePost(id)
  const { data: apiComments, isLoading: loadingComments } = usePostComments(id)
  const { mutate: deletePost, isPending: deleting } = useDeletePost()
  const { mutate: createComment, isPending: sendingComment } = useCreateComment()

  // Comentarios locales (persisten) + comentarios de la API
  const comments = [...localComments, ...(apiComments || [])]

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(commentSchema),
  })

  // ── FIX 3: Guardar el comentario en localStorage al enviarlo ─
  const onCommentSubmit = (data) => {
    createComment(
      { postId: Number(id), ...data },
      {
        onSuccess: (res) => {
          // Construir comentario local con ID secuencial dentro del post
          const existing = JSON.parse(localStorage.getItem(commentKey(id)) || '[]')
          const newComment = {
            ...res,
            // ── FIX 2: ID = posición (1, 2, 3…) dentro de los comentarios de este post ──
            id: existing.length + 1,
            name:  data.name,
            email: data.email,
            body:  data.body,
            isNew: true,
          }
          const updated = [newComment, ...existing]
          localStorage.setItem(commentKey(id), JSON.stringify(updated))
          setLocalComments(updated)
          reset()
          toast.success('¡Comentario publicado!', 'Tu comentario fue enviado exitosamente.')
        },
        onError: () => toast.error('Error', 'No se pudo enviar el comentario.'),
      }
    )
  }

  const handleDelete = () => {
    deletePost(Number(id), {
      onSuccess: () => {
        // Limpiar localStorage del post eliminado
        const saved = JSON.parse(localStorage.getItem('local-posts') || '[]')
        localStorage.setItem('local-posts', JSON.stringify(saved.filter(p => String(p.id) !== id)))
        const edits = JSON.parse(localStorage.getItem('post-edits') || '{}')
        delete edits[id]
        localStorage.setItem('post-edits', JSON.stringify(edits))
        localStorage.removeItem(commentKey(id))

        toast.success('Post eliminado', 'El post fue eliminado correctamente.')
        navigate('/posts')
      },
      onError: () => toast.error('Error', 'No se pudo eliminar.'),
    })
  }

  if (loadingPost) return <DetailSkeleton />

  if (isError) return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <p className="font-display text-2xl text-red-400 mb-4">Post no encontrado</p>
        <Link to="/posts" className="text-[#d4a843] font-body text-sm hover:underline">← Volver a posts</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-body text-slate-500">
          <Link to="/posts" className="hover:text-[#d4a843] transition-colors">Posts</Link>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-300 truncate max-w-[240px]">{post?.title}</span>
        </div>

        {/* ── Artículo ── */}
        <article className="bg-[#0a1628] border border-[rgba(212,168,67,0.15)] rounded-2xl overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#d4a843] to-transparent" />
          <div className="p-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-[#d4a843]/70
              bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.15)] rounded-full px-3 py-1 mb-5">
              Post #{post.id}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight capitalize mb-6">
              {post.title}
            </h1>
            <p className="text-slate-400 font-body text-base leading-relaxed">{post.body}</p>

            {/* Acciones */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[rgba(212,168,67,0.1)]">
              <Link
                to={`/posts/${id}/edit`}
                className="flex items-center gap-2 px-5 py-2.5 bg-[rgba(212,168,67,0.1)]
                  hover:bg-[rgba(212,168,67,0.2)] border border-[rgba(212,168,67,0.25)]
                  text-[#d4a843] font-body font-medium text-sm rounded-xl transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Editar
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-900/20 hover:bg-red-900/40
                  border border-red-800/40 text-red-400 font-body font-medium text-sm rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </article>

        {/* ── Sección de comentarios ── */}
        <section className="space-y-6">

          {/* Separador decorativo */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[rgba(212,168,67,0.1)]" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#d4a843]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <span className="text-slate-500 text-xs font-body uppercase tracking-widest whitespace-nowrap">
                Comentarios
              </span>
            </div>
            <div className="flex-1 h-px bg-[rgba(212,168,67,0.1)]" />
          </div>

          {/* Título + contador */}
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-white">Comentarios del post</h2>
            {!loadingComments && (
              <span className="bg-[#0f2044] text-[#d4a843] text-xs font-body font-medium px-3 py-1
                rounded-full border border-[rgba(212,168,67,0.2)]">
                {comments.length}
              </span>
            )}
          </div>

          {/* Skeleton de comentarios */}
          {loadingComments && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#0a1628] rounded-2xl p-5 border border-[rgba(212,168,67,0.08)] space-y-3">
                  <div className="flex gap-3">
                    <div className="shimmer w-9 h-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="shimmer h-3.5 w-1/3 rounded" />
                      <div className="shimmer h-3 w-1/4 rounded" />
                    </div>
                  </div>
                  <div className="shimmer h-3 w-full rounded" />
                  <div className="shimmer h-3 w-4/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Lista de comentarios */}
          {!loadingComments && (
            <div className="space-y-3">
              {comments.map((c, idx) => <CommentCard key={`${c.id}-${idx}`} comment={c} />)}
              {comments.length === 0 && (
                <p className="text-slate-600 font-body text-sm text-center py-6">
                  Aún no hay comentarios. ¡Sé el primero!
                </p>
              )}
            </div>
          )}

          {/* Formulario para agregar comentario */}
          <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.2)] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[rgba(212,168,67,0.1)] rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Agregar comentario</h3>
                <p className="text-slate-500 text-xs font-body">Responde a este post</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onCommentSubmit)} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CommentField label="Nombre" error={errors.name?.message}>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Tu nombre"
                    className={commentInputClass(errors.name)}
                  />
                </CommentField>
                <CommentField label="Correo electrónico" error={errors.email?.message}>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="tu@correo.com"
                    className={commentInputClass(errors.email)}
                  />
                </CommentField>
              </div>
              <CommentField label="Comentario" error={errors.body?.message}>
                <textarea
                  {...register('body')}
                  rows={4}
                  placeholder="Escribe tu comentario…"
                  className={commentInputClass(errors.body) + ' resize-none'}
                />
              </CommentField>
              <button
                type="submit"
                disabled={sendingComment}
                className="w-full sm:w-auto px-8 py-3 bg-[#d4a843] hover:bg-[#c09535] active:scale-95
                  text-[#04080f] font-body font-semibold text-sm rounded-xl
                  transition-all duration-200 flex items-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingComment ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Enviando…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Publicar comentario
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Modal eliminar */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Eliminar post">
        <div className="space-y-4">
          <div className="p-4 bg-red-900/20 border border-red-800/40 rounded-xl">
            <p className="text-red-300 font-body text-sm font-medium">¿Confirmas la eliminación de este post?</p>
            <p className="text-red-500 text-xs mt-1 font-body">Esta acción no se puede deshacer.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(212,168,67,0.2)]
                text-slate-400 font-body text-sm hover:text-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600
                text-white font-body font-semibold text-sm disabled:opacity-50
                flex items-center justify-center gap-2 transition-all"
            >
              {deleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Eliminando…
                </>
              ) : 'Eliminar'}
            </button>
          </div>
        </div>
      </Modal>

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
            className="text-[#C49102] hover:underline transition-all">
            MateoRiosdev.
          </a>
          ) - Todos los derechos reservados
        </p>
      </footer>

      <ScrollToTopButton />
    </div>
  )
}

// ── Sub-componentes ───────────────────────────────────────────
function CommentCard({ comment }) {
  const initials = comment.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
  const colors = [
    'bg-violet-800 text-violet-200', 'bg-sky-800 text-sky-200',
    'bg-emerald-800 text-emerald-200', 'bg-rose-800 text-rose-200',
    'bg-amber-800 text-amber-200',
  ]
  const color = colors[comment.name.charCodeAt(0) % colors.length]

  return (
    <article className={`bg-[#0a1628] rounded-2xl p-5 border transition-all duration-300
      ${comment.isNew
        ? 'border-[rgba(212,168,67,0.5)] shadow-[0_0_16px_rgba(212,168,67,0.08)]'
        : 'border-[rgba(212,168,67,0.08)]'
      }`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-slate-200 font-body font-medium text-sm truncate">{comment.name}</p>
            {comment.isNew && (
              <span className="text-[10px] text-[#d4a843] font-body font-medium bg-[rgba(212,168,67,0.1)]
                px-2 py-0.5 rounded-full border border-[rgba(212,168,67,0.2)] shrink-0">
                Nuevo
              </span>
            )}
          </div>
          <p className="text-slate-600 font-body text-xs mb-2 truncate">{comment.email}</p>
          <p className="text-slate-400 font-body text-sm leading-relaxed">{comment.body}</p>
        </div>
      </div>
    </article>
  )
}

function commentInputClass(error) {
  return `w-full bg-[#04080f] border text-slate-200 placeholder-slate-600 font-body text-sm rounded-xl px-4 py-3
    focus:outline-none focus:ring-1 transition-all duration-200
    ${error
      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
      : 'border-[rgba(212,168,67,0.2)] focus:border-[#d4a843] focus:ring-[rgba(212,168,67,0.2)]'
    }`
}

function CommentField({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-body font-medium text-slate-400">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400 font-body">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="shimmer h-4 w-40 rounded" />
        <div className="bg-[#0a1628] rounded-2xl p-8 space-y-4 border border-[rgba(212,168,67,0.08)]">
          <div className="shimmer h-6 w-20 rounded-full" />
          <div className="shimmer h-8 w-3/4 rounded-xl" />
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  )
}
