import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/about.tsx"),
  route("projects", "routes/projects.tsx"),
  route("contact", "routes/contact.tsx"),
  route("cv", "routes/cv.tsx"),
] satisfies RouteConfig
