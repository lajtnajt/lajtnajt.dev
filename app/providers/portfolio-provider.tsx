import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type Language = "hu" | "en"

type PortfolioContextType = {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (lang: Language) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  return (
    <PortfolioContext.Provider
      value={{ theme, language, setTheme, setLanguage }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
