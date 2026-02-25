import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className="relative bg-[#0a1628] border border-[rgba(212,168,67,0.2)] rounded-2xl
        shadow-2xl shadow-black/60 w-full max-w-md animate-scale-in">
        {/* Barra superior dorada */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#d4a843] to-transparent rounded-t-2xl" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
