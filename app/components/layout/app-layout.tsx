import { Sidebar } from "./sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <Sidebar />

      <main className="flex-1 px-4 pt-20 pb-8 sm:ml-64 sm:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
