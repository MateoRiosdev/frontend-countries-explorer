import { useState, useEffect } from 'react'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  body: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
})

export default function PostForm({ countryCode }) {
  const [form, setForm] = useState({ title: '', body: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)

  // Cargar comentarios al montar o cuando cambie el país
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('comments') || '[]')
    const filtered = countryCode ? stored.filter(c => c.country === countryCode) : stored
    setComments(filtered)
  }, [countryCode])

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsed = postSchema.safeParse(form)

    if (!parsed.success) {
      const err = {}
      parsed.error.errors.forEach(e => { err[e.path[0]] = e.message })
      setErrors(err)
      return
    }

    setErrors({})
    const comment = {
      id: Math.floor(Math.random() * 100000), // ID único
      title: form.title,
      body: form.body,
      country: countryCode,
      createdAt: new Date().toISOString(),
    }

    // Guardar en localStorage
    const storedComments = JSON.parse(localStorage.getItem('comments') || '[]')
    localStorage.setItem('comments', JSON.stringify([...storedComments, comment]))

    // Actualizar estado local para mostrar inmediatamente
    setComments(prev => [...prev, comment])
    setSuccess(`¡Comentario enviado! ID: #${comment.id}`)
    setForm({ title: '', body: '' })
  }

  return (
    <div>
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-[#0a1628] rounded mb-4">
        <h2 className="text-xl font-bold mb-4 text-white">Crear Comentario</h2>

        <input
          type="text"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Título"
          className="w-full mb-2 p-2 rounded bg-[#1a2638] text-white"
        />
        {errors.title && <p className="text-red-500 mb-2">{errors.title}</p>}

        <textarea
          value={form.body}
          onChange={e => setForm({ ...form, body: e.target.value })}
          placeholder="Contenido"
          className="w-full mb-2 p-2 rounded bg-[#1a2638] text-white"
        />
        {errors.body && <p className="text-red-500 mb-2">{errors.body}</p>}

        <button type="submit" className="bg-[#d4a843] px-4 py-2 rounded text-[#04080f]">
          Enviar
        </button>

        {success && <p className="text-green-400 mt-2">{success}</p>}
      </form>

      {/* Buzón de comentarios */}
      <div className="max-w-md mx-auto mb-6">
        <button
          onClick={() => setShowComments(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a2638] rounded text-white hover:bg-[#2a3b58] transition"
        >
          📨 Ver Comentarios ({comments.length})
        </button>

        {showComments && (
          <div className="mt-2 space-y-2 p-2 bg-[#0a1628] rounded">
            {comments.length > 0 ? (
              comments.map(c => (
                <div key={c.id} className="p-2 bg-[#1a2638] rounded">
                  <p className="text-sm text-slate-300 font-medium">{c.title}</p>
                  <p className="text-sm text-slate-400">{c.body}</p>
                  <p className="text-xs text-slate-500">
                    ID: #{c.id} • {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 mt-2">No hay comentarios para este país.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}