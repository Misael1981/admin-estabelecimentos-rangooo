"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { OrderStatus } from "@misael1981/rangooo-database"
import {
  CheckCircle,
  ChefHat,
  Clock,
  LucideIcon,
  Motorbike,
  Package,
  XCircle,
} from "lucide-react"

type CheckboxStatusProps = {
  status: OrderStatus
}

interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: LucideIcon
  label: string
  color: string
}

export const STATUS_CONFIGS: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    variant: "secondary",
    icon: Clock,
    label: "Pendente",
    color: "text-pink-800 bg-pink-200",
  },
  CONFIRMED: {
    variant: "default",
    icon: CheckCircle,
    label: "Confirmado",
    color: "text-blue-600 bg-blue-50",
  },
  PREPARING: {
    variant: "default",
    icon: ChefHat,
    label: "Em Preparo",
    color: "text-orange-600 bg-orange-50",
  },
  OUT_FOR_DELIVERY: {
    variant: "default",
    icon: Motorbike,
    label: "Saiu para entrega",
    color: "text-yellow-600 bg-yellow-50",
  },
  READY_FOR_PICKUP: {
    variant: "default",
    icon: Package,
    label: "Pronto para retirada",
    color: "text-purple-600 bg-purple-50",
  },
  DELIVERED: {
    variant: "default",
    icon: CheckCircle,
    label: "Entregue",
    color: "text-green-600 bg-green-50",
  },
  CANCELED: {
    variant: "destructive",
    icon: XCircle,
    label: "Cancelado",
    color: "text-red-600 bg-red-50",
  },
}

const CheckboxStatus = ({ status }: CheckboxStatusProps) => {
  return (
    <FieldGroup className="gap-2">
      {Object.entries(STATUS_CONFIGS).map(([key, config]) => {
        const isActive = key === status
        const Icon = config.icon

        return (
          <Field
            key={key}
            orientation="horizontal"
            className={`flex items-center gap-3 rounded-lg border p-2 transition-all ${
              isActive
                ? `${config.color} border-current`
                : "bg-muted/40 text-muted-foreground opacity-60"
            } `}
          >
            <Checkbox checked={isActive} />

            <div className="flex items-center gap-2">
              <Icon className="size-4" />

              <FieldLabel className="cursor-pointer">{config.label}</FieldLabel>
            </div>
          </Field>
        )
      })}
    </FieldGroup>
  )
}

export default CheckboxStatus
