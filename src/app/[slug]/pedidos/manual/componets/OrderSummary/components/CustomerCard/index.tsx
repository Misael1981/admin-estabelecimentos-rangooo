import { PAYMENT_METHOD_LABEL } from "@/constants/labels"
import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { MapPin, ShoppingBag, UserRound } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"

const CustomerCard = () => {
  const { control } = useFormContext<ManualOrderFormInput>()
  const [
    method,
    name,
    phone,
    code,
    pickupTime,
    address,
    paymentMethod,
    changeAmount,
  ] = useWatch({
    control,
    name: [
      "consumptionMethod",
      "customerName",
      "customerPhone",
      "customerCode",
      "pickupTime",
      "address",
      "paymentMethod",
      "changeAmount",
    ],
  })

  const changeValue = Number(changeAmount ?? 0)

  return (
    <div className="w-full space-y-3 border-b-2 pb-4">
      <div className="flex w-full justify-between">
        <div className="flex items-start gap-3">
          <UserRound className="text-muted-foreground mt-0.5 size-4" />
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{name || "Nome do cliente"}</p>
              <p className="text-muted-foreground text-sm">
                {phone || "Telefone não informado"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 flex w-fit max-w-xs items-center justify-between rounded-lg border p-3">
          <p className="text-muted-foreground text-sm font-medium">
            Código do Cliente:{" "}
            <strong className="text-base font-bold text-green-500">
              {code}
            </strong>
          </p>
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
      <div className="flex items-start justify-between gap-2">
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
          <div className="bg-muted/50 flex max-w-xs flex-col gap-1 rounded-lg border p-3">
            <span className="text-muted-foreground text-sm">
              Horário de Retirada
            </span>
            <span className="text-center text-sm text-amber-500">
              {pickupTime}
            </span>
          </div>
        )}

        {method === "DELIVERY" && (
          <div className="bg-muted/50 flex max-w-xs flex-col gap-1 rounded-lg border p-3 text-center">
            <span className="text-muted-foreground text-sm font-medium">
              Método de pagamento
            </span>

            <span className="text-sm font-semibold text-amber-500">
              {paymentMethod && PAYMENT_METHOD_LABEL[paymentMethod]
                ? PAYMENT_METHOD_LABEL[paymentMethod]
                : "Não informado"}
            </span>

            {/* Exibe o troco de forma clara se o pagamento for em Dinheiro e houver valor definido */}
            {paymentMethod === "CASH" && changeValue > 0 && (
              <span className="text-muted-foreground text-xs">
                Troco para:{" "}
                <strong className="text-foreground">
                  {changeValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerCard
