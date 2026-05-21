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
import DialogCancelOrder from "../DialogCancelOrder"

type SelectStatusProps = {
  status: OrderStatus
  slug: string | undefined
  orderId: string
}

const SelectStatus = ({ status, slug, orderId }: SelectStatusProps) => {
  const router = useRouter()
  const [currentStatusKey, setCurrentStatusKey] = useState<OrderStatus>(status)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const currentStatus = STATUS_CONFIGS[currentStatusKey]
  const CurrentIcon = currentStatus.icon

  const executeStatusUpdate = async (targetStatus: OrderStatus) => {
    try {
      const result = await updateOrderStatus(orderId, targetStatus, slug!)

      if (!result.success) {
        toast.error("Erro ao atualizar status")
        return false
      }

      setCurrentStatusKey(targetStatus)

      toast.success("Status atualizado!")
      router.refresh()
      return true
    } catch {
      toast.error("Erro inesperado.")
      return false
    }
  }

  const handleStatusChangeAttempt = async (newStatus: string) => {
    const target = newStatus as OrderStatus

    if (target === "CANCELED") {
      setIsCancelDialogOpen(true)
      return
    }

    await executeStatusUpdate(target)
  }

  const handleConfirmCancel = async () => {
    const success = await executeStatusUpdate("CANCELED")
    if (success) {
      setIsCancelDialogOpen(false)
    }
  }

  return (
    <div className="flex w-full justify-center gap-2 sm:justify-end lg:w-fit">
      <Select
        onValueChange={handleStatusChangeAttempt}
        value={currentStatusKey}
      >
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

      <DialogCancelOrder
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}

export default SelectStatus
