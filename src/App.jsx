import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Header from './components/Header' // 👈 IMPORTAR

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}
