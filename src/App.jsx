import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CountryDetailPage from './pages/CountryDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/country/:code" element={<CountryDetailPage />} />
    </Routes>
  )
}
