import { useQuery } from '@tanstack/react-query'
import { fetchPostById } from '../api/posts'

export function usePost(id) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const numId = Number(id)

      // ── Posts locales (ID asignado secuencialmente ≥ 101) ──
      if (numId > 100) {
        const localPosts = JSON.parse(localStorage.getItem('local-posts') || '[]')
        const local = localPosts.find(p => p.id === numId)
        if (!local) throw new Error('Post no encontrado')
        // Aplicar ediciones locales si existen
        const edits = JSON.parse(localStorage.getItem('post-edits') || '{}')
        return edits[id] ? { ...local, ...edits[id] } : local
      }

      // ── Posts de la API ──
      const post = await fetchPostById(id)
      // Aplicar ediciones locales por encima de la respuesta de la API
      const edits = JSON.parse(localStorage.getItem('post-edits') || '{}')
      return edits[id] ? { ...post, ...edits[id] } : post
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
