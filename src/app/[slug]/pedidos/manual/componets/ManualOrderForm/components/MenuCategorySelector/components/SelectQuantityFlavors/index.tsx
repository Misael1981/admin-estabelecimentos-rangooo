"use client"

import { Button } from "@/components/ui/button"

type SelectQuantityFlavorsProps = {
  selectTwoFlavors: boolean
  onSelectTwoFlavors: (value: boolean) => void
}

const SelectQuantityFlavors = ({
  selectTwoFlavors,
  onSelectTwoFlavors,
}: SelectQuantityFlavorsProps) => {
  return (
    <section className="space-y-2">
      <h4 className="text-muted-foreground text-center text-sm font-medium">
        Quantidade de sabores
      </h4>

      <div className="bg-muted/40 mx-auto flex w-fit gap-2 rounded-lg border p-1">
        <Button
          type="button"
          size="sm"
          variant={!selectTwoFlavors ? "default" : "ghost"}
          aria-pressed={!selectTwoFlavors}
          onClick={() => onSelectTwoFlavors(false)}
        >
          1 Sabor
        </Button>

        <Button
          type="button"
          size="sm"
          variant={selectTwoFlavors ? "default" : "ghost"}
          aria-pressed={selectTwoFlavors}
          onClick={() => onSelectTwoFlavors(true)}
        >
          2 Sabores
        </Button>
      </div>
    </section>
  )
}

export default SelectQuantityFlavors
