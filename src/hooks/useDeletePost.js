import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '../api/posts'

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}
