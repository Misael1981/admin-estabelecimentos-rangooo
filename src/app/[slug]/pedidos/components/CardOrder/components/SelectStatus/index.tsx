"use client"

import { updateOrderStatus } from "@/app/actions/update-order-status"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_CONFIGS } from "@/constants/maps-options"
import { OrderStatus } from "@misael1981/rangooo-database"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type SelectStatusProps = {
  status: OrderStatus
  slug: string | undefined
  orderId: string
}

const SelectStatus = ({ status, slug, orderId }: SelectStatusProps) => {
  const router = useRouter()
  const [currentStatusKey, setCurrentStatusKey] = useState<OrderStatus>(status)

  const currentStatus = STATUS_CONFIGS[currentStatusKey]
  const CurrentIcon = currentStatus.icon

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const result = await updateOrderStatus(
        orderId,
        newStatus as OrderStatus,
        slug!,
      )

      if (!result.success) {
        toast.error("Erro ao atualizar status")
        return
      }

      setCurrentStatusKey(newStatus as OrderStatus)
      toast.success("Status atualizado!")
      router.refresh()
    } catch {
      toast.error("Erro inesperado.")
    }
  }

  return (
    <div className="flex w-full justify-center sm:justify-end lg:w-fit">
      <Select onValueChange={handleStatusUpdate} value={currentStatusKey}>
        {" "}
        {/* ← value em vez de defaultValue */}
        <SelectTrigger
          className={`w-56 border-none shadow-none ${currentStatus.color}`}
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className="size-4" />
            <SelectValue>{currentStatus.label}</SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATUS_CONFIGS).map(([status, config]) => {
            const Icon = config.icon
            return (
              <SelectItem key={status} value={status}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectStatus
