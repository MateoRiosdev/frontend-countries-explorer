import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../api/posts'

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts({ page, limit: 10 }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })
}
