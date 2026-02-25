import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePost } from '../api/posts'

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      // Solo invalida la lista, NO el post individual
      // (el detalle lo actualiza PostEditPage con setQueryData + localStorage)
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
