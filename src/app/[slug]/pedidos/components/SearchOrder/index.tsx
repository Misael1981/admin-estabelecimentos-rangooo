"use client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const SearchOrder = () => {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "")

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set("query", searchTerm)
    } else {
      params.delete("query")
    }
    // Atualiza a URL sem recarregar a página inteira, o Next.js re-executa a Server Page
    replace(`?${params.toString()}`)
  }

  return (
    <section className="flex w-full justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <h2 className="text-xl font-semibold">Buscar pedido</h2>

        <Field orientation="horizontal" className="w-full">
          <Input
            type="number"
            placeholder="Número do pedido"
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>Buscar</Button>
        </Field>
      </div>
    </section>
  )
}

export default SearchOrder
