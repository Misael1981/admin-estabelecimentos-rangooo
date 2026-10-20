"use client"

import { Input } from "@/components/ui/input"
import { CustomerDTO } from "@/dtos/manual-order.dto"
import { useMemo, useState } from "react"

type SearchCustomerProps = {
  customers: CustomerDTO[]
  onSelect: (customer: CustomerDTO) => void
  onClear: () => void
}

const SearchCustomer = ({
  customers,
  onSelect,
  onClear,
}: SearchCustomerProps) => {
  const [term, setTerm] = useState("")

  const results = useMemo(() => {
    const value = term.trim().toLowerCase()
    if (!value) return []

    const digits = value.replace(/\D/g, "")

    return customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(value) ||
          String(c.customerCode) === value ||
          (digits.length >= 4 && c.phone?.replace(/\D/g, "").includes(digits)),
      )
      .slice(0, 8)
  }, [term, customers])

  const handleSelect = (customer: CustomerDTO) => {
    onSelect(customer)
    setTerm("")
  }

  return (
    <div className="relative w-full max-w-xl">
      <Input
        value={term}
        onChange={(e) => {
          setTerm(e.target.value)
          if (!e.target.value) onClear()
        }}
        placeholder="Buscar por nome, telefone ou código..."
      />

      {results.length > 0 && (
        <ul className="bg-background absolute z-10 mt-1 w-full rounded-md border shadow-md">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button" // importante: sem isso ele envia o form
                onClick={() => handleSelect(c)}
                className="hover:bg-muted flex w-full flex-col px-3 py-2 text-left"
              >
                <span className="text-sm font-medium">
                  #{c.customerCode} · {c.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  {c.phone ?? "Sem telefone"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchCustomer
