import type { InertiaLinkProps } from "@inertiajs/react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toUrl(href: NonNullable<InertiaLinkProps["href"]>): string {
  if (typeof href === "string") {
    return href
  }

  const value = href as any

  if (typeof value.url === "string") {
    return value.url
  }

  if (value instanceof URL) {
    return value.toString()
  }

  if (typeof value.pathname === "string") {
    const pathname = value.pathname as string
    const search = typeof value.search === "string" ? value.search : ""
    const hash = typeof value.hash === "string" ? value.hash : ""
    return `${pathname}${search}${hash}`
  }

  return String(value)
}
