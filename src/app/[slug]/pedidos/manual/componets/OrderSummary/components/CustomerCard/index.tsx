import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { MapPin, ShoppingBag, UserRound } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"

const CustomerCard = () => {
  const { control } = useFormContext<ManualOrderFormInput>()
  const [method, name, phone, code, pickupTime, address] = useWatch({
    control,
    name: [
      "consumptionMethod",
      "customerName",
      "customerPhone",
      "customerCode",
      "pickupTime",
      "address",
    ],
  })

  return (
    <div className="w-full space-y-3 border-b-2 pb-4">
      <div className="flex w-full items-start gap-3">
        <UserRound className="text-muted-foreground mt-0.5 size-4" />

        <div className="flex w-full justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{name || "Nome do cliente"}</p>

            <p className="text-muted-foreground text-sm">
              {phone || "Telefone não informado"}
            </p>
          </div>
        </div>
        <div className="ml-auto flex min-w-35 flex-col items-end">
          <p className="text-muted-foreground text-sm whitespace-nowrap">
            Código do Cliente
          </p>
          <p className="text-center text-sm text-green-500">{code}</p>
        </div>
      </div>

      {address && (
        <div className="flex items-start gap-3">
          <MapPin className="text-muted-foreground mt-0.5 size-4" />

          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium">
              {address.street || "Rua não informada"}
              {address.number ? `, ${address.number}` : ""}
            </p>

            <p className="text-muted-foreground">
              {[address.neighborhood, address.city, address.state]
                .filter(Boolean)
                .join(" - ")}
            </p>

            {address.complement && (
              <p className="text-muted-foreground">{address.complement}</p>
            )}
          </div>
        </div>
      )}

      {/* Método de Consumo */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-muted-foreground size-4" />
          <span className="text-sm">
            {method === "DELIVERY"
              ? "Entrega"
              : method === "PICKUP"
                ? "Retirada"
                : method === "DINE_IN"
                  ? "Consumo no local"
                  : "Modalidade não selecionada"}
          </span>
        </div>

        {method === "PICKUP" && (
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">
              Horário de Retirada
            </span>
            <span className="text-center text-sm text-amber-500">
              {pickupTime}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerCard
