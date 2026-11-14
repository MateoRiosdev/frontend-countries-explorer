import { z } from 'zod'

// ── Esquema Zod compartido para Crear y Editar ─────────────────
export const postSchema = z.object({
  title: z
    .string()
    .min(5,  'El título debe tener al menos 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  body: z
    .string()
    .min(10, 'El contenido debe tener al menos 10 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),
})

// ── Componente reutilizable de campo ──────────────────────────
export function Field({ label, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-body font-medium text-slate-300">{label}</label>
      {children}
      {hint && !error && <p className="text-slate-600 font-body text-xs">{hint}</p>}
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

export function inputClass(error) {
  return `w-full bg-[#04080f] border text-slate-200 placeholder-slate-600 font-body text-sm rounded-xl px-4 py-3
    focus:outline-none focus:ring-1 transition-all duration-200
    ${error
      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
      : 'border-[rgba(212,168,67,0.2)] focus:border-[#d4a843] focus:ring-[rgba(212,168,67,0.2)]'
    }`
}
