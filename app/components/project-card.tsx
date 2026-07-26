import React from "react"

interface ProjectCardProps {
  title: string
  url: string
  displayUrl?: string
  description: string
  techNames: string[]
}

export function ProjectCard({
  title,
  url,
  displayUrl,
  description,
  techNames,
}: ProjectCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg border border-zinc-200 bg-zinc-50 p-6 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:bg-zinc-900"
    >
      <div className="space-y-3">
        <div className="flex items-baseline gap-3">
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-black dark:text-slate-50 dark:group-hover:text-white">
            {title}
          </h3>
          {displayUrl && (
            <span className="text-sm font-medium text-zinc-500 transition-colors group-hover:text-zinc-700 dark:group-hover:text-zinc-400">
              {displayUrl}
            </span>
          )}
        </div>
        <p className="text-zinc-600 dark:text-muted-foreground">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {techNames.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
