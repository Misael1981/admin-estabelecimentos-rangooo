"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react" // Importei o X para o botão de limpar a busca
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"

const SearchCustomers = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }

    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setSearchTerm("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex justify-center">
      <div className="flex w-full max-w-2xl gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Busque pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

export default SearchCustomers
