import { useMutation } from '@tanstack/react-query'
import { createComment } from '../api/comments'

export function useCreateComment() {
  return useMutation({
    mutationFn: createComment,
  })
}
