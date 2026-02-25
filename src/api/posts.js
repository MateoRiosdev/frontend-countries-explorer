import axios from 'axios'

export const postsApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

// ── READ ──────────────────────────────────────────────────────
export async function fetchPosts({ page = 1, limit = 10 } = {}) {
  const start = (page - 1) * limit
  const res = await postsApi.get(`/posts?_start=${start}&_limit=${limit}`)
  // JSONPlaceholder tiene 100 posts en total
  return { data: res.data, total: 100 }
}

export async function fetchPostById(id) {
  const res = await postsApi.get(`/posts/${id}`)
  return res.data
}

// ── CREATE ────────────────────────────────────────────────────
export async function createPost(payload) {
  const res = await postsApi.post('/posts', payload)
  return res.data
}

// ── UPDATE ────────────────────────────────────────────────────
export async function updatePost({ id, ...payload }) {
  const res = await postsApi.put(`/posts/${id}`, payload)
  return res.data
}

// ── DELETE ────────────────────────────────────────────────────
export async function deletePost(id) {
  await postsApi.delete(`/posts/${id}`)
  return id
}

// ── COMMENTS of a post ────────────────────────────────────────
export async function fetchPostComments(postId) {
  const res = await postsApi.get(`/posts/${postId}/comments`)
  return res.data
}
