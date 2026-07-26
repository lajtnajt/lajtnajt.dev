import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router"
import { usePortfolio } from "~/providers/portfolio-provider"
import translations from "~/json/translations.json"
import { Menu, X, Sun, Moon } from "lucide-react"

export function Sidebar() {
  const { language, setLanguage, theme, setTheme } = usePortfolio()
  const location = useLocation()
  const t = translations[language]

  const [isOpen, setIsOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  const langMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const navItems = [
    { path: "/", label: t.about.title },
    { path: "/projects", label: t.projects.title },
    { path: "/contact", label: t.contact.title },
    { path: "/cv", label: t.cv.title },
  ]

  const handleNavClick = () => setIsOpen(false)

  return (
    <aside
      className={`fixed top-0 left-0 z-40 flex flex-col bg-white text-zinc-900 transition-all duration-300 sm:h-screen sm:w-64 sm:border-r sm:border-zinc-200 dark:bg-zinc-950 dark:text-slate-50 dark:sm:border-zinc-800 ${
        isOpen
          ? "h-screen w-full"
          : "h-16 w-full border-b border-zinc-200 sm:border-b-0 dark:border-zinc-800"
      } `}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:mb-6 sm:h-auto sm:flex-col sm:items-start sm:px-5 sm:pt-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">lajtnajt.dev</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-500 hover:text-zinc-900 sm:hidden dark:text-zinc-400 dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`mt-4 flex w-full items-center justify-start gap-4 sm:flex ${
            isOpen ? "flex" : "hidden sm:flex"
          }`}
        >
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative" ref={langMenuRef}>
            {isLangOpen && (
              <div className="absolute top-full left-0 mt-2 flex flex-col rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  onClick={() => {
                    setLanguage("hu")
                    setIsLangOpen(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <span>🇭🇺</span> HU
                </button>
                <button
                  onClick={() => {
                    setLanguage("en")
                    setIsLangOpen(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <span>🇬🇧</span> EN
                </button>
              </div>
            )}
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex h-8 items-center gap-2 rounded-md bg-zinc-100 px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <span>{language === "hu" ? "🇭🇺" : "🇬🇧"}</span>
              <span className="uppercase">{language}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col overflow-y-auto px-3 py-4 sm:flex ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <ul className="flex-1 space-y-2 font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`group flex items-center rounded-lg p-2 transition-colors ${
                    isActive
                      ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  <span className="ms-3">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex items-center justify-center px-2">
            <span className="text-sm text-zinc-500">
              © {new Date().getFullYear()} lajtnajt.dev
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
