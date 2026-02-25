import { Link } from 'react-router-dom'
import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import { useDeletePost } from '../../hooks/useDeletePost'
import { useToast } from '../../context/ToastContext'

// displayNumber = posición global en la lista (1, 2, 3…) para todos los posts
export default function PostCard({ post, localPosts, setLocalPosts, displayNumber }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: deletePost, isPending } = useDeletePost()
  const toast = useToast()

  const isLocal = localPosts?.some(p => p.id === post.id)

  const handleDelete = () => {
    deletePost(post.id, {
      onSuccess: () => {
        if (setLocalPosts) {
          setLocalPosts(prev => {
            const updated = prev.filter(p => p.id !== post.id)
            localStorage.setItem('local-posts', JSON.stringify(updated))
            return updated
          })
        }
        // Limpiar ediciones y comentarios del post eliminado
        const edits = JSON.parse(localStorage.getItem('post-edits') || '{}')
        delete edits[String(post.id)]
        localStorage.setItem('post-edits', JSON.stringify(edits))
        localStorage.removeItem(`post-comments-${post.id}`)

        toast.success('Post eliminado', `"${post.title.slice(0, 40)}" fue eliminado.`)
        setShowConfirm(false)
      },
      onError: () => toast.error('Error', 'No se pudo eliminar el post.'),
    })
  }

  return (
    <>
      <article className="group bg-[#0a1628] border border-[rgba(212,168,67,0.1)] hover:border-[rgba(212,168,67,0.35)]
        rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* ── FIX 2: Mostrar número local (1, 2…) o ID de API ── */}
            <div className="w-8 h-8 rounded-lg bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.15)]
              flex items-center justify-center shrink-0 text-xs font-body font-bold text-[#d4a843]/70">
              {displayNumber ?? post.id}
            </div>
            {isLocal && (
              <span className="text-[10px] text-[#d4a843] font-body font-medium bg-[rgba(212,168,67,0.1)]
                px-2 py-0.5 rounded-full border border-[rgba(212,168,67,0.2)]">
                Nuevo
              </span>
            )}
          </div>

          {/* Acciones (visibles al hacer hover) */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link
              to={`/posts/${post.id}/edit`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#d4a843] hover:bg-[rgba(212,168,67,0.08)]
                transition-all duration-150"
              title="Editar"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20
                transition-all duration-150"
              title="Eliminar"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Título */}
        <h3 className="font-display font-semibold text-white text-base leading-snug capitalize
          group-hover:text-[#d4a843] transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {/* Body preview */}
        <p className="text-slate-500 font-body text-sm leading-relaxed line-clamp-3 flex-1">
          {post.body}
        </p>

        {/* Link detalle */}
        <Link
          to={`/posts/${post.id}`}
          className="flex items-center gap-1.5 text-xs font-body font-medium text-[#d4a843]/50
            hover:text-[#d4a843] transition-colors duration-200 self-start mt-auto"
        >
          Ver detalle
          <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </article>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Eliminar post">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800/40 rounded-xl">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-red-300 font-body text-sm font-medium">¿Estás seguro?</p>
              <p className="text-red-500 font-body text-xs mt-1">
                Esta acción no se puede deshacer. El post "
                <span className="font-medium">{post.title.slice(0, 50)}</span>" será eliminado permanentemente.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(212,168,67,0.2)]
                text-slate-400 font-body text-sm hover:border-[rgba(212,168,67,0.4)] hover:text-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600
                text-white font-body font-semibold text-sm transition-all
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
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
    </>
  )
}
