"use client"

import { usePathname, useParams } from "next/navigation"
import Link from "next/link"
import React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const BreadcrumbDashboarding = () => {
  const pathname = usePathname()
  const params = useParams()
  const slug = params.slug as string

  const allSegments = pathname.split("/").filter(Boolean)

  const segments = allSegments.slice(1)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${slug}`}>Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          // Monta a URL válida acumulando os segmentos até o atual
          const href = `/${slug}/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="capitalize">
                      {segment}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbDashboarding
