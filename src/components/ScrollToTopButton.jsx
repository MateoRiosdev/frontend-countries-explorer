import { useEffect, useState } from "react"

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50
      bg-[#d4a843] text-[#04080f]
      w-12 h-12 rounded-full shadow-lg
      transition-all duration-300
      hover:scale-110
      ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      ↑
    </button>
  )
}
