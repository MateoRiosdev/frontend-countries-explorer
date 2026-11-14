import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreatePost } from '../hooks/useCreatePost'
import { useToast } from '../context/ToastContext'
import { postSchema, Field, inputClass } from '../features/posts/PostFormFields'
import Navbar from '../components/Navbar'

import { migrateLocalPosts, nextLocalId } from '../utils/localPostsUtils'

export default function PostCreatePage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreatePost()
  const toast = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
  })

  const onSubmit = (data) => {
    mutate(
      { ...data, userId: 1 },
      {
        onSuccess: () => {
          // ✅ ID secuencial legible (101, 102…) en lugar de Date.now()
          const localId  = nextLocalId()
          const newPost  = { id: localId, userId: 1, ...data, isNew: true }
          const saved    = JSON.parse(localStorage.getItem('local-posts') || '[]')
          localStorage.setItem('local-posts', JSON.stringify([newPost, ...saved]))

          toast.success('¡Post creado!', `"${data.title.slice(0, 40)}" fue creado exitosamente.`)
          navigate('/posts')
        },
        onError: () => toast.error('Error', 'No se pudo crear el post. Inténtalo de nuevo.'),
      }
    )
  }

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
          <span className="text-slate-300">Nuevo post</span>
        </div>

        <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.2)] rounded-2xl overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#d4a843] to-transparent" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[rgba(212,168,67,0.1)] rounded-xl flex items-center justify-center border border-[rgba(212,168,67,0.2)]">
                <svg className="w-5 h-5 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">Crear post</h1>
                <p className="text-slate-500 font-body text-sm">Nuevo post en JSONPlaceholder</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <Field label="Título" error={errors.title?.message} hint="Entre 5 y 100 caracteres">
                <input
                  {...register('title')}
                  type="text"
                  placeholder="Escribe un título para tu post…"
                  className={inputClass(errors.title)}
                  autoFocus
                />
              </Field>
              <Field label="Contenido" error={errors.body?.message} hint="Entre 10 y 1000 caracteres">
                <textarea
                  {...register('body')}
                  rows={6}
                  placeholder="Escribe el contenido del post…"
                  className={inputClass(errors.body) + ' resize-none'}
                />
              </Field>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/posts"
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
                      Creando…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Crear post
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
