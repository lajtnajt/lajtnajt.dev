import type { Route } from "./+types/about"
import { usePortfolio } from "~/providers/portfolio-provider"
import translations from "~/json/translations.json"
import techStack from "../json/techStack.json"
import projects from "../json/projects.json"
import { useEffect } from "react"
import { ProjectCard } from "~/components/project-card"

export function meta({ location }: Route.MetaArgs) {
  return [
    { title: "Ádám Odin | Portfolio" },
    {
      name: "description",
      content: "Data analyst and full-stack software developer portfolio.",
    },
    { property: "og:title", content: "Ádám Odin | Portfolio" },
    {
      property: "og:description",
      content: "Data analyst and full-stack software developer portfolio.",
    },
    { property: "og:type", content: "website" },
    {
      name: "keywords",
      content:
        "Ádám Odin, portfolio, web developer, data analyst, full-stack, React, Laravel, Python",
    },
  ]
}

export default function About() {
  const { language } = usePortfolio()
  const t = translations[language].about
  const tProjects = translations[language].projects

  useEffect(() => {
    document.title = `${t.title} | Ádám Odin`
  }, [language, t.title])

  const featuredProjects = projects.filter((project) => project.featured)

  const getTechName = (id: number) => {
    const tech = techStack.find((t) => t.id === id)
    return tech ? tech.name : ""
  }

  return (
    <div className="mx-auto max-w-3xl space-y-16 px-4 py-6 sm:px-6">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 lg:text-5xl dark:text-slate-50">
          {t.title}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-muted-foreground">
          {t.description}
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-slate-50">
          {t.tech_stack}
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {techStack.map((tech) => (
            <a
              key={tech.id}
              href={tech.link}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 transition-transform hover:scale-110"
            >
              <img
                src={tech.icon}
                alt={tech.name}
                className="h-12 w-12 object-contain"
                title={tech.name}
              />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {tech.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-slate-50">
          {t.featured_projects}
        </h2>

        <div className="grid gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              url={project.url}
              displayUrl={project.displayUrl}
              description={
                tProjects[`${project.id}_desc` as keyof typeof tProjects]
              }
              techNames={project.techIds.map(getTechName)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
