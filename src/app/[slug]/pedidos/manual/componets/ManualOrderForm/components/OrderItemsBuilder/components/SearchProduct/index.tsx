"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type SearchProductProps = {
  searchValue: string
  setSearchValue: (value: string) => void
  label: string
}

const SearchProduct = ({
  searchValue,
  setSearchValue,
  label,
}: SearchProductProps) => {
  return (
    <section className="flex flex-col items-center gap-2">
      <h3 className="px-5 pt-2 text-center text-2xl font-semibold">{label}</h3>
      <div className="flex w-full max-w-lg gap-2 px-5 py-4">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Busque um sabor ou ingrediente..."
            className="pl-9"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {searchValue && (
          <Button variant="ghost" size="sm" onClick={() => setSearchValue("")}>
            Limpar
          </Button>
        )}
      </div>
    </section>
  )
}

export default SearchProduct
