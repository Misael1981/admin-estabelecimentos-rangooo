import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PaymentReceiptStatus } from "@/constants/enums"
import { formatDateDayMonthYear } from "@/helpers/format-data"
import { CreditCard, FileText, Printer, Receipt } from "lucide-react"
import { ReceiptDTO } from "../ListReceipts"

type ReceiptCardProps = {
  receipt: ReceiptDTO
  onPrint: (receipt: ReceiptDTO) => void
}

const STATUS_CONFIG: Record<
  PaymentReceiptStatus,
  { label: string; className: string }
> = {
  PAID: {
    label: "Pago",
    className: "bg-emerald-100 text-emerald-700",
  },
  PENDING: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-700",
  },
  CANCELED: {
    label: "Cancelado",
    className: "bg-muted text-muted-foreground",
  },
  OVERDUE: {
    label: "Atrasado",
    className: "bg-red text-red-foreground",
  },
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  PIX: "PIX",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  BANK_TRANSFER: "Transferência bancária",
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const ReceiptCard = ({ receipt, onPrint }: ReceiptCardProps) => {
  const status = STATUS_CONFIG[receipt.status]

  return (
    <Card className="w-full max-w-72 gap-0 overflow-hidden">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-muted-foreground flex items-center gap-2">
            <Receipt className="size-4" />
            <span className="text-xs font-medium">
              Recibo #{receipt.receiptNumber}
            </span>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <CardTitle className="pt-3 text-2xl">
          {currencyFormatter.format(receipt.amount)}
        </CardTitle>

        <p className="text-muted-foreground text-sm">
          {receipt.paidAt
            ? `Pago em ${formatDateDayMonthYear(receipt.paidAt)}`
            : `Vencimento: ${formatDateDayMonthYear(receipt.dueDate)}`}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 py-4">
        <div className="flex items-start gap-2.5">
          <CreditCard className="text-muted-foreground mt-0.5 size-4 shrink-0" />

          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Forma de pagamento</p>
            <p className="text-sm font-medium wrap-break-word">
              {receipt.paymentMethod
                ? (PAYMENT_METHOD_LABEL[receipt.paymentMethod] ??
                  receipt.paymentMethod)
                : "Não informada"}
            </p>
          </div>
        </div>

        {receipt.notes && (
          <div className="flex items-start gap-2.5">
            <FileText className="text-muted-foreground mt-0.5 size-4 shrink-0" />

            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Observações</p>
              <p className="line-clamp-3 text-sm wrap-break-word">
                {receipt.notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onPrint(receipt)}
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Recibo
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ReceiptCard
