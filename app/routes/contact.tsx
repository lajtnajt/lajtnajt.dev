import type { Route } from "./+types/contact"
import { usePortfolio } from "~/providers/portfolio-provider"
import translations from "~/json/translations.json"
import contacts from "../json/contacts.json"
import { Mail, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { sendEmail } from "~/services/email-service"
import { z } from "zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export function meta({ location }: Route.MetaArgs) {
  return [
    { title: "Ádám Odin | Contact" },
    {
      name: "description",
      content:
        "Get in touch with Ádám Odin. Reach out for project ideas, collaboration, or job opportunities in software development and data analysis.",
    },
    { property: "og:title", content: "Ádám Odin | Contact" },
    {
      property: "og:description",
      content:
        "Get in touch with Ádám Odin. Reach out for project ideas, collaboration, or job opportunities in software development and data analysis.",
    },
    { property: "og:type", content: "website" },
    {
      name: "keywords",
      content:
        "contact, Ádám Odin, hire developer, freelance, web developer, data analyst, get in touch",
    },
  ]
}

type ValidationErrors = Record<string, string>

export default function Contact() {
  const { language } = usePortfolio()
  const t = translations[language].contact

  useEffect(() => {
    document.title = `${t.title} | Ádám Odin`
  }, [language, t.title])

  const contactSchema = z.object({
    name: z
      .string()
      .trim()
      .refine((val) => val.split(/\s+/).length >= 2, { message: t.error_name }),
    email: z.string().email({ message: t.error_email }),
    subject: z.string().min(1, { message: t.error_subject }),
    message: z.string().min(200, { message: t.error_message }),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    const result = contactSchema.safeParse(data)

    if (!result.success) {
      const fieldErrors: ValidationErrors = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await sendEmail(formData)
      setIsSuccess(true)
      e.currentTarget.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-12 py-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-slate-50">
          {t.title}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-muted-foreground">
          {t.description}
        </p>
      </div>

      <div className="space-y-10">
        <div className="flex flex-wrap gap-4">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={contact.href}
              target={contact.href.startsWith("mailto") ? undefined : "_blank"}
              rel={contact.href.startsWith("mailto") ? undefined : "noreferrer"}
              className="group flex flex-1 basis-[180px] flex-col items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-200 group-hover:bg-zinc-300 dark:bg-zinc-900 dark:group-hover:bg-zinc-800">
                {contact.iconType === "lucide-mail" ? (
                  <Mail className="h-6 w-6 text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white" />
                ) : (
                  <img
                    src={contact.iconUrl}
                    alt={contact.label}
                    className="h-6 w-6 opacity-70 transition-opacity group-hover:opacity-100 dark:invert"
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-slate-50">
                  {contact.label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {contact.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-slate-50">
              {t.title}
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              {t.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
                <p className="text-lg font-medium text-zinc-900 dark:text-slate-50">
                  {t.success_message}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  {t.new_message}
                </Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      {t.name}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      onFocus={() => clearError("name")}
                      className="border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-50 dark:focus-visible:ring-zinc-700"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      {t.email}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      onFocus={() => clearError("email")}
                      className="border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-50 dark:focus-visible:ring-zinc-700"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className="text-zinc-700 dark:text-zinc-300"
                  >
                    {t.subject}
                  </Label>
                  <Select
                    name="subject"
                    defaultValue="question"
                    onOpenChange={() => clearError("subject")}
                  >
                    <SelectTrigger className="border-zinc-200 bg-zinc-50 text-zinc-900 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-50 dark:focus:ring-zinc-700">
                      <SelectValue placeholder={t.subject} />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-50">
                      <SelectItem
                        value="business"
                        className="focus:bg-zinc-100 focus:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-white"
                      >
                        {t.subject_business}
                      </SelectItem>
                      <SelectItem
                        value="question"
                        className="focus:bg-zinc-100 focus:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-white"
                      >
                        {t.subject_question}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-zinc-700 dark:text-zinc-300"
                  >
                    {t.message}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t.message_placeholder}
                    onFocus={() => clearError("message")}
                    className="max-h-[150px] min-h-[150px] resize-none border-zinc-200 bg-zinc-50 text-zinc-900 focus-visible:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-50 dark:focus-visible:ring-zinc-700 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-900 text-slate-50 hover:bg-zinc-800 disabled:opacity-50 dark:bg-slate-50 dark:text-zinc-950 dark:hover:bg-slate-200"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isSubmitting ? t.sending : t.send}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
