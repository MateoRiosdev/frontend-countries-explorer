import { useQuery } from '@tanstack/react-query'
import { fetchCommentsByPostId } from '../api/comments'

export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  })
}
