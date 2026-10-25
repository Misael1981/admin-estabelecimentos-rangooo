// components/CustomerCodeBadge.tsx
"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"

const CustomerCodeBadge = () => {
  const { control } = useFormContext<ManualOrderFormInput>()

  const [customerCode, suggested] = useWatch({
    control,
    name: ["customerCode", "suggestedCustomerCode"],
  })

  const isExisting = customerCode !== undefined

  return (
    <div className="flex justify-end">
      <div className="bg-muted/50 max-w-xs rounded-lg border p-3">
        <p className="text-muted-foreground text-sm font-medium">
          {isExisting
            ? "Cliente cadastrado: "
            : "Novo cliente, código provável: "}
          <strong className="text-primary text-base font-bold">
            #{customerCode ?? suggested}
          </strong>
        </p>
      </div>
    </div>
  )
}

export default CustomerCodeBadge
