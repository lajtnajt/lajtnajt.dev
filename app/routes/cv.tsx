import { useEffect } from "react"
import { useNavigate } from "react-router"
import { usePortfolio } from "~/providers/portfolio-provider"

export default function Cv() {
  const { language } = usePortfolio()
  const navigate = useNavigate()

  useEffect(() => {
    const pdfUrl = `cv-${language}.pdf`
    window.open(pdfUrl, "_blank")
    navigate(-1)
  }, [language, navigate])

  return null
}
