import { useMutation } from '@tanstack/react-query'
import { createPost } from '../api/posts'

export function useCreatePost() {
  return useMutation({
    mutationFn: createPost,
  })
}
