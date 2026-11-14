import { Routes, Route } from 'react-router-dom'
import HomePage          from './pages/HomePage'
import CountryDetailPage from './pages/CountryDetailPage'
import PostsPage         from './pages/PostsPage'
import PostDetailPage    from './pages/PostDetailPage'
import PostCreatePage    from './pages/PostCreatePage'
import PostEditPage      from './pages/PostEditPage'

export default function App() {
  return (
    <Routes>
      {/* ── Countries ── */}
      <Route path="/"               element={<HomePage />} />
      <Route path="/country/:code"  element={<CountryDetailPage />} />

      {/* ── Posts CRUD ── */}
      <Route path="/posts"          element={<PostsPage />} />
      <Route path="/posts/new"      element={<PostCreatePage />} />
      <Route path="/posts/:id"      element={<PostDetailPage />} />
      <Route path="/posts/:id/edit" element={<PostEditPage />} />
    </Routes>
  )
}
