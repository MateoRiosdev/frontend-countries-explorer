import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error:   (title, message) => addToast({ type: 'error',   title, message }),
    info:    (title, message) => addToast({ type: 'info',    title, message }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

// ── Toast Container ───────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

const TOAST_STYLES = {
  success: {
    bar:  'bg-emerald-500',
    icon: 'bg-emerald-900/50 text-emerald-400',
    border: 'border-emerald-800/50',
    title: 'text-emerald-300',
  },
  error: {
    bar:  'bg-red-500',
    icon: 'bg-red-900/50 text-red-400',
    border: 'border-red-800/50',
    title: 'text-red-300',
  },
  info: {
    bar:  'bg-[#d4a843]',
    icon: 'bg-amber-900/50 text-[#d4a843]',
    border: 'border-amber-800/30',
    title: 'text-[#d4a843]',
  },
}

const ICONS = {
  success: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
}

function ToastItem({ toast, onRemove }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info

  return (
    <div
      className={`pointer-events-auto relative bg-[#0a1628] border ${s.border} rounded-2xl overflow-hidden
        shadow-2xl shadow-black/60 animate-slide-in`}
    >
      {/* Barra de color superior */}
      <div className={`h-0.5 w-full ${s.bar}`} />

      <div className="flex items-start gap-3 p-4">
        {/* Icono */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.icon}`}>
          {ICONS[toast.type]}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <p className={`font-body font-semibold text-sm ${s.title}`}>{toast.title}</p>
          {toast.message && (
            <p className="text-slate-500 font-body text-xs mt-0.5 leading-relaxed">{toast.message}</p>
          )}
        </div>

        {/* Cerrar */}
        <button
          onClick={() => onRemove(toast.id)}
          className="text-slate-600 hover:text-slate-300 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
