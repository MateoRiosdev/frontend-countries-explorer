import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

export async function createPost(data) {
  const response = await api.post('/posts', data)
  return response.data
}

export async function fetchPosts() {
  const response = await api.get('/posts?_limit=5')
  return response.data
}
