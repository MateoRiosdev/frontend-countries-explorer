import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePost } from '../hooks/usePost'
import { useUpdatePost } from '../hooks/useUpdatePost'
import { useToast } from '../context/ToastContext'
import { postSchema, Field, inputClass } from '../features/posts/PostFormFields'
import Navbar from '../components/Navbar'

export default function PostEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: post, isLoading, isError } = usePost(id)
  const { mutate, isPending } = useUpdatePost()
  const toast = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
  })

  useEffect(() => {
    if (post) reset({ title: post.title, body: post.body })
  }, [post, reset])

  // ── Función compartida para guardar los cambios localmente ──
  const saveEditsLocally = (data) => {
    // 1. Guardar en post-edits (persiste entre recargas para todos los posts)
    const edits = JSON.parse(localStorage.getItem('post-edits') || '{}')
    edits[id] = { title: data.title, body: data.body }
    localStorage.setItem('post-edits', JSON.stringify(edits))

    // 2. Actualizar caché inmediatamente para que el detalle refleje el cambio
    qc.setQueryData(['post', id], (old) =>
      old ? { ...old, title: data.title, body: data.body } : old
    )

    // 3. Para posts locales también actualizar el array en local-posts
    const numId = Number(id)
    if (numId > 100) {
      const localPosts = JSON.parse(localStorage.getItem('local-posts') || '[]')
      const updated = localPosts.map(p =>
        p.id === numId ? { ...p, title: data.title, body: data.body } : p
      )
      localStorage.setItem('local-posts', JSON.stringify(updated))
    }

    // 4. Invalidar la LISTA para que PostsPage también muestre el cambio
    qc.invalidateQueries({ queryKey: ['posts'] })
  }

  const onSubmit = (data) => {
    const numId = Number(id)

    // ── FIX 3b: Posts locales (id > 100) → NO llamar a la API (fallaría) ──
    // JSONPlaceholder no tiene esos IDs reales, el PUT devolvería error.
    if (numId > 100) {
      saveEditsLocally(data)
      toast.success('Post actualizado', `"${data.title.slice(0, 40)}" fue actualizado.`)
      navigate(`/posts/${id}`)
      return
    }

    // ── Posts de la API (id 1-100) → llamar a la API y guardar localmente ──
    mutate(
      { id: numId, ...data, userId: post?.userId ?? 1 },
      {
        onSuccess: () => {
          saveEditsLocally(data)
          toast.success('Post actualizado', `"${data.title.slice(0, 40)}" fue actualizado.`)
          navigate(`/posts/${id}`)
        },
        onError: () => toast.error('Error', 'No se pudo actualizar el post.'),
      }
    )
  }

  if (isLoading) return <EditSkeleton />

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

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-body text-slate-500 mb-8">
          <Link to="/posts" className="hover:text-[#d4a843] transition-colors">Posts</Link>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to={`/posts/${id}`} className="hover:text-[#d4a843] transition-colors truncate max-w-[180px]">
            Post #{id}
          </Link>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-300">Editar</span>
        </div>

        <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.2)] rounded-2xl overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#d4a843] to-transparent" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[rgba(212,168,67,0.1)] rounded-xl flex items-center justify-center border border-[rgba(212,168,67,0.2)]">
                <svg className="w-5 h-5 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">Editar post</h1>
                <p className="text-slate-500 font-body text-sm">Post #{id}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <Field label="Título" error={errors.title?.message}>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="Título del post"
                  className={inputClass(errors.title)}
                />
              </Field>
              <Field label="Contenido" error={errors.body?.message}>
                <textarea
                  {...register('body')}
                  rows={6}
                  placeholder="Contenido del post"
                  className={inputClass(errors.body) + ' resize-none'}
                />
              </Field>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to={`/posts/${id}`}
                  className="w-full sm:w-auto text-center px-8 py-3 rounded-xl border border-[rgba(212,168,67,0.2)]
                    text-slate-400 font-body text-sm hover:border-[rgba(212,168,67,0.4)] hover:text-slate-200 transition-all"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 py-3 bg-[#d4a843] hover:bg-[#c09535] active:scale-95
                    text-[#04080f] font-body font-semibold text-sm rounded-xl
                    transition-all duration-200 flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Guardando…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

function EditSkeleton() {
  return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <div className="shimmer h-5 w-48 rounded-lg" />
        <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.1)] rounded-2xl p-8 space-y-5">
          <div className="shimmer h-8 w-1/3 rounded-xl" />
          <div className="shimmer h-12 w-full rounded-xl" />
          <div className="shimmer h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
