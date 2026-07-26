import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  Link,
  type LinksFunction,
} from "react-router"
import { PortfolioProvider, usePortfolio } from "./providers/portfolio-provider"
import { AppLayout } from "./components/layout/app-layout"
import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import translations from "~/json/translations.json"
import "./app.css"

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/ico", href: "/lajtnajt/favicon.ico" },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </PortfolioProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <PortfolioProvider>
      <AppLayout>
        <ErrorContent error={error} />
      </AppLayout>
    </PortfolioProvider>
  )
}

function ErrorContent({ error }: { error: unknown }) {
  const { language } = usePortfolio()
  const t = translations[language as keyof typeof translations].error

  let status = 500
  if (isRouteErrorResponse(error)) {
    status = error.status
  }

  const title =
    status === 404
      ? t["404_title"]
      : t.generic_title.replace("{status}", status.toString())

  const description =
    status === 404 ? t["404_description"] : t.generic_description

  useEffect(() => {
    document.title = `${status} | Ádám Odin`
  }, [status])

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-10 py-24 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-slate-50">
          {title}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-muted-foreground">
          {description}
        </p>
      </div>

      <Button
        asChild
        className="bg-zinc-900 text-slate-50 hover:bg-zinc-800 dark:bg-slate-50 dark:text-zinc-950 dark:hover:bg-slate-200"
      >
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.back_home}
        </Link>
      </Button>
    </div>
  )
}
