import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

/**
 * Convierte un código CCA3 en un postId determinístico (1-100).
 * Así cada país siempre carga los mismos comentarios base.
 * Ej: COL → (67+79+76) % 100 + 1 = 23
 */
export function cca3ToPostId(cca3) {
  const sum = cca3
    .toUpperCase()
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return (sum % 100) + 1
}

export async function fetchCommentsByPostId(postId) {
  const res = await api.get(`/posts/${postId}/comments`)
  return res.data
}

export async function createComment({ postId, name, email, body }) {
  const res = await api.post('/comments', { postId, name, email, body })
  return res.data
}
