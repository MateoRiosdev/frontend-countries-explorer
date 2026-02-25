import { useQuery } from '@tanstack/react-query'
import { fetchPostComments } from '../api/posts'

export function usePostComments(postId) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: () => {
      // Los posts locales (ID > 100) no tienen comentarios en la API
      if (Number(postId) > 100) return Promise.resolve([])
      return fetchPostComments(postId)
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  })
}
