"use client"

import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

type MenuPagesProps = {
  slug: string
}

const MenuPages = ({ slug }: MenuPagesProps) => {
  const pathname = usePathname()

  const PAGES_MAP = [
    {
      id: 1,
      url: `/${slug}/pedidos`,
      label: "Central de Pedidos",
    },
    {
      id: 2,
      url: `/${slug}/pedidos/manual`,
      label: "Pedido Manual",
    },
  ]

  return (
    <div className="flex justify-center gap-2">
      {PAGES_MAP.map((p) => {
        const isSelected = pathname === p.url

        return (
          <Link
            key={p.id}
            href={p.url}
            className={buttonVariants({
              variant: isSelected ? "default" : "outline",
            })}
          >
            {p.label}
          </Link>
        )
      })}
    </div>
  )
}

export default MenuPages
