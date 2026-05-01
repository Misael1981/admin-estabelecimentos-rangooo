"use client"

import { usePathname, useParams } from "next/navigation"
import Link from "next/link"
import React from "react" // Importante para o Fragment

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

  const segments = pathname.split("/").filter(Boolean).slice(2)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${slug}/dashboard`}>Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          // Reconstrói o href corretamente incluindo o slug e dashboard
          const href = `/${slug}/dashboard/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {segment.replace("-", " ")}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="capitalize">
                      {segment.replace("-", " ")}
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
