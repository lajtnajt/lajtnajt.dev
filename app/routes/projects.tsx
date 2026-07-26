import type { Route } from "./+types/projects"
import { usePortfolio } from "~/providers/portfolio-provider"
import translations from "~/json/translations.json"
import techStack from "../json/techStack.json"
import projects from "../json/projects.json"
import { useEffect, useState, useMemo } from "react"
import { ProjectCard } from "~/components/project-card"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Checkbox } from "~/components/ui/checkbox"

export function meta({ location }: Route.MetaArgs) {
  return [
    { title: "Ádám Odin | Projects" },
    {
      name: "description",
      content:
        "Explore my latest projects in data analysis and full-stack software development.",
    },
    { property: "og:title", content: "Ádám Odin | Projects" },
    {
      property: "og:description",
      content:
        "Explore my latest projects in data analysis and full-stack software development.",
    },
    { property: "og:type", content: "website" },
    {
      name: "keywords",
      content:
        "projects, portfolio, Ádám Odin, web development, data analysis, React, Laravel",
    },
  ]
}

const PROJECT_TYPES = ["personal", "commercial", "website", "application"]
const ITEMS_PER_PAGE = 3

export default function Projects() {
  const { language } = usePortfolio()
  const t = translations[language].projects

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTechs, setSelectedTechs] = useState<number[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    document.title = `${t.title} | Ádám Odin`
  }, [language, t.title])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTechs, selectedTypes])

  const getTechName = (id: number) => {
    const tech = techStack.find((t) => t.id === id)
    return tech ? tech.name : ""
  }

  const toggleTech = (id: number) => {
    setSelectedTechs((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    )
  }

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const removeTech = (id: number) => {
    setSelectedTechs((prev) => prev.filter((tId) => tId !== id))
  }

  const removeType = (type: string) => {
    setSelectedTypes((prev) => prev.filter((t) => t !== type))
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedTechs([])
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const descKey = `${project.id}_desc` as keyof typeof t
      const description = (t[descKey] as string) || ""

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.displayUrl &&
          project.displayUrl.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTech =
        selectedTechs.length === 0 ||
        selectedTechs.some((id) => project.techIds.includes(id))

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) => project.type.includes(type))

      return matchesSearch && matchesTech && matchesType
    })
  }, [searchQuery, selectedTechs, selectedTypes, t])

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ]
  }

  const filterCount = selectedTypes.length + selectedTechs.length

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-6 pb-28 sm:px-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-slate-50">
          {t.title}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-muted-foreground">
          {t.description}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            type="text"
            placeholder={t.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex w-full gap-2 sm:w-auto">
                <Filter className="h-4 w-4" />
                {t.filters}
                {filterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-sm px-1 font-normal"
                  >
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 sm:w-96">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <h4 className="leading-none font-medium">{t.filter_type}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {PROJECT_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t[`type_${type}` as keyof typeof t]}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="leading-none font-medium">{t.filter_tech}</h4>
                  <ScrollArea className="h-[200px] border border-zinc-200 p-4 dark:border-zinc-800">
                    <div className="space-y-4">
                      {techStack.map((tech) => (
                        <div
                          key={tech.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`tech-${tech.id}`}
                            checked={selectedTechs.includes(tech.id)}
                            onCheckedChange={() => toggleTech(tech.id)}
                          />
                          <label
                            htmlFor={`tech-${tech.id}`}
                            className="flex cursor-pointer items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <img
                              src={tech.icon}
                              alt=""
                              className="h-4 w-4 object-contain"
                            />
                            {tech.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="px-2 text-sm"
                  >
                    {t.clear_all}
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>
                    {t.apply}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {filterCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {t[`type_${type}` as keyof typeof t]}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() => removeType(type)}
                />
              </Badge>
            ))}
            {selectedTechs.map((id) => (
              <Badge
                key={id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {getTechName(id)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() => removeTech(id)}
                />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              {t.clear_all}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {paginatedProjects.length > 0 ? (
          paginatedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              url={project.url}
              displayUrl={project.displayUrl}
              description={t[`${project.id}_desc` as keyof typeof t]}
              techNames={project.techIds.map(getTechName)}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
            {t.no_results}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="fixed right-0 bottom-0 left-0 z-40 bg-white/80 backdrop-blur-md sm:left-64 dark:bg-zinc-950/80">
          <div className="mx-auto flex h-[53px] max-w-3xl items-center justify-center border-t border-zinc-200 px-4 sm:px-6 dark:border-zinc-800">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    onClick={() => setCurrentPage(pageNum as number)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
