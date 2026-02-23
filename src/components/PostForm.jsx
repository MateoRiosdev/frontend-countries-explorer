import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePost } from '../hooks/useCreatePost'
import { useState } from 'react'

const postSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'Máximo 60 caracteres'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido'),
  titulo: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
})

export default function PostForm() {
  const [successData, setSuccessData] = useState(null)
  const { mutate, isPending } = useCreatePost()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  })

  const onSubmit = (data) => {
    const payload = {
      userId: 1,
      title: data.titulo,
      body: data.mensaje,
      name: data.nombre,
      email: data.email,
    }
    mutate(payload, {
      onSuccess: (res) => {
        setSuccessData(res)
        reset()
      },
    })
  }

  return (
    <section className="bg-[#0a1628] border border-[rgba(212,168,67,0.2)] rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[rgba(212,168,67,0.1)] rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-white">Dejar un comentario</h2>
          <p className="text-slate-500 text-sm font-body">Comparte tu opinión sobre este país</p>
        </div>
      </div>

      {/* Success message */}
      {successData && (
        <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-700/40 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-emerald-400 font-body font-medium text-sm">¡Comentario enviado exitosamente!</p>
            <p className="text-emerald-600 text-xs mt-0.5 font-body">
              ID generado: <span className="font-medium text-emerald-500">#{successData.id}</span>
            </p>
          </div>
          <button
            onClick={() => setSuccessData(null)}
            className="ml-auto text-emerald-700 hover:text-emerald-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Nombre + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" error={errors.nombre?.message}>
            <input
              {...register('nombre')}
              type="text"
              placeholder="Tu nombre"
              className={inputClass(errors.nombre)}
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

        {/* Título */}
        <Field label="Título" error={errors.titulo?.message}>
          <input
            {...register('titulo')}
            type="text"
            placeholder="Título de tu comentario"
            className={inputClass(errors.titulo)}
          />
        </Field>

        {/* Mensaje */}
        <Field label="Mensaje" error={errors.mensaje?.message}>
          <textarea
            {...register('mensaje')}
            rows={4}
            placeholder="Escribe tu comentario sobre este país…"
            className={inputClass(errors.mensaje) + ' resize-none'}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3 bg-[#d4a843] hover:bg-[#c09535] text-[#04080f] font-body font-semibold text-sm rounded-xl
            transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Enviar comentario
            </>
          )}
        </button>
      </form>
    </section>
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
