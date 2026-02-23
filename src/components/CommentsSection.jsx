import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useComments } from '../hooks/useComments'
import { useCreateComment } from '../hooks/useCreateComment'
import { cca3ToPostId } from '../api/comments'

// ── Esquema de validación Zod ─────────────────────────────────
const commentSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'Máximo 60 caracteres'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido'),
  body: z
    .string()
    .min(10, 'El comentario debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
})

// ── Componente principal ──────────────────────────────────────
export default function CommentsSection({ countryCode, countryName }) {
  const postId = cca3ToPostId(countryCode)
  const { data: baseComments, isLoading } = useComments(postId)
  const { mutate, isPending } = useCreateComment()

  // Comentarios nuevos se guardan localmente (optimistic)
  const [localComments, setLocalComments] = useState([])

  const allComments = [...localComments, ...(baseComments || [])]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(commentSchema) })

  const onSubmit = (data) => {
    mutate(
      { postId, ...data },
      {
        onSuccess: (res) => {
          // Mostrar nuevo comentario inmediatamente arriba de la lista
          setLocalComments(prev => [{
            ...res,
            id: Date.now(), // ID único local
            name: data.name,
            email: data.email,
            body: data.body,
            isNew: true,
          }, ...prev])
          reset()
        },
      }
    )
  }

  return (
    <section className="space-y-8">

      {/* ── Encabezado ── */}
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

      {/* ── Lista de comentarios ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">
            Comentarios sobre {countryName}
          </h2>
          {!isLoading && (
            <span className="bg-[#0f2044] text-[#d4a843] text-xs font-body font-medium px-3 py-1 rounded-full border border-[rgba(212,168,67,0.2)]">
              {allComments.length} comentarios
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#0a1628] rounded-2xl p-5 border border-[rgba(212,168,67,0.08)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="shimmer w-9 h-9 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <div className="shimmer h-3.5 w-1/3 rounded" />
                    <div className="shimmer h-3 w-1/4 rounded" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="shimmer h-3 w-full rounded" />
                  <div className="shimmer h-3 w-4/5 rounded" />
                  <div className="shimmer h-3 w-3/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comments list */}
        {!isLoading && (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {allComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>

      {/* ── Formulario para nuevo comentario ── */}
      <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.2)] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[rgba(212,168,67,0.1)] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Agregar comentario</h3>
            <p className="text-slate-500 text-xs font-body">Comparte tu opinión sobre {countryName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Nombre + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre" error={errors.name?.message}>
              <input
                {...register('name')}
                type="text"
                placeholder="Tu nombre"
                className={inputClass(errors.name)}
              />
            </Field>
            <Field label="Correo electrónico" error={errors.email?.message}>
              <input
                {...register('email')}
                type="email"
                placeholder="tu@correo.com"
                className={inputClass(errors.email)}
              />
            </Field>
          </div>

          {/* Comentario */}
          <Field label="Comentario" error={errors.body?.message}>
            <textarea
              {...register('body')}
              rows={4}
              placeholder={`Escribe tu comentario sobre ${countryName}…`}
              className={inputClass(errors.body) + ' resize-none'}
            />
            {/* Contador de caracteres */}
          </Field>

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-8 py-3 bg-[#d4a843] hover:bg-[#c09535] active:scale-95
              text-[#04080f] font-body font-semibold text-sm rounded-xl
              transition-all duration-200 flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
  )
}

// ── Sub-componentes ───────────────────────────────────────────
function CommentCard({ comment }) {
  // Iniciales del avatar
  const initials = comment.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  // Color del avatar basado en el nombre (determinístico)
  const avatarColors = [
    'bg-violet-800 text-violet-200',
    'bg-sky-800 text-sky-200',
    'bg-emerald-800 text-emerald-200',
    'bg-rose-800 text-rose-200',
    'bg-amber-800 text-amber-200',
    'bg-cyan-800 text-cyan-200',
  ]
  const colorIdx = comment.name.charCodeAt(0) % avatarColors.length
  const avatarColor = avatarColors[colorIdx]

  return (
    <article className={`bg-[#0a1628] rounded-2xl p-5 border transition-all duration-300
      ${comment.isNew
        ? 'border-[rgba(212,168,67,0.5)] shadow-[0_0_16px_rgba(212,168,67,0.08)]'
        : 'border-[rgba(212,168,67,0.08)]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-body font-bold shrink-0 ${avatarColor}`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-slate-200 font-body font-medium text-sm truncate">{comment.name}</p>
            {comment.isNew && (
              <span className="text-[10px] text-[#d4a843] font-body font-medium bg-[rgba(212,168,67,0.1)] px-2 py-0.5 rounded-full border border-[rgba(212,168,67,0.2)] shrink-0">
                Nuevo
              </span>
            )}
          </div>
          <p className="text-slate-600 font-body text-xs mb-3 truncate">{comment.email}</p>
          <p className="text-slate-400 font-body text-sm leading-relaxed">{comment.body}</p>
        </div>
      </div>
    </article>
  )
}

function inputClass(error) {
  return `w-full bg-[#04080f] border text-slate-200 placeholder-slate-600 font-body text-sm rounded-xl px-4 py-3
    focus:outline-none focus:ring-1 transition-all duration-200
    ${error
      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
      : 'border-[rgba(212,168,67,0.2)] focus:border-[#d4a843] focus:ring-[rgba(212,168,67,0.2)]'
    }`
}

function Field({ label, error, children }) {
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
