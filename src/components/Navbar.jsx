import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  {
    to: '/',
    label: 'Países',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253m0 0a11.95 11.95 0 005.523 7.243M3.284 14.253A8.955 8.955 0 0012 16.5c2.998 0 5.74-1.1 7.843-2.918" />
      </svg>
    ),
    matchExact: true,
  },
  {
    to: '/posts',
    label: 'Posts',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    matchExact: false,
  },
]

export default function Navbar() {
  const location = useLocation()

  const isActive = (link) => link.matchExact
    ? location.pathname === link.to
    : location.pathname.startsWith(link.to)

  return (
    <nav className="bg-[#0a1628]/95 backdrop-blur-md border-b border-[rgba(212,168,67,0.12)] sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="/logo.png"
          alt="Logo Explorador de Países"
          className="w-12 h-12 object-contain transition-transform group-hover:scale-105" 
        />
        <span className="font-display font-semibold text-white text-xl hidden sm:block"> 
          {/* Aumentado de text-sm a text-xl */}
          Hilo<span className="text-[#d4a843]"> Mundo</span>
        </span>
      </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = isActive(link)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body font-medium
                  transition-all duration-200
                  ${active
                    ? 'bg-[rgba(212,168,67,0.12)] text-[#d4a843] border border-[rgba(212,168,67,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
