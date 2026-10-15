import { ReceiptDTO } from "../ListReceipts"
import { PAYMENT_RECEIPT_LABELS } from "@/constants/labels"
import { PAYMENT_RECEIPT_OPTIONS } from "@/constants/options"
import { formatDateDayMonthYear } from "@/helpers/format-data"
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Store,
} from "lucide-react"

type ReceiptPrintTemplateProps = {
  receipt: ReceiptDTO
  establishmentName?: string
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const ReceiptPrintTemplate = ({
  receipt,
  establishmentName,
}: ReceiptPrintTemplateProps) => {
  const statusConfig = PAYMENT_RECEIPT_OPTIONS.find(
    (option) => option.value === receipt.status,
  ) ?? {
    value: receipt.status,
    label: PAYMENT_RECEIPT_LABELS[receipt.status],
  }

  const isPaid = receipt.paidAt !== null

  const dateLabel = isPaid ? "Data do pagamento" : "Data de vencimento"
  const receiptDate = receipt.paidAt ?? receipt.dueDate

  return (
    <div className="print-container mx-auto w-full max-w-75 bg-white p-4 font-mono text-black">
      {/* Cabeçalho */}
      <header className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Store className="size-5" strokeWidth={2.5} />
          <h1 className="text-xl font-black tracking-tight">SISTEMA RANGOOO</h1>
        </div>

        <p className="text-[10px] font-medium tracking-[0.2em] uppercase">
          Comprovante de pagamento
        </p>

        <div className="border-t-2 border-dashed border-black pt-3">
          <p className="text-xs text-gray-600 uppercase">Estabelecimento</p>
          <h2 className="wrap-break mt-1 text-base font-bold">
            {establishmentName || "Estabelecimento"}
          </h2>
        </div>
      </header>

      {/* Identificação do recibo */}
      <section className="my-2 space-y-2 border-y border-dashed border-black py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-600">Recibo nº</span>
          <span className="text-sm font-bold">
            {String(receipt.receiptNumber).padStart(4, "0")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-600">Status</span>
          <span className="text-xs font-black uppercase">
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs text-gray-600">{dateLabel}</span>
          <span className="text-right text-xs font-bold">
            {formatDateDayMonthYear(receiptDate)}
          </span>
        </div>
      </section>

      {/* Valor */}
      <section className="py-2 text-center">
        <p className="text-xs tracking-wider text-gray-600 uppercase">
          Valor do pagamento
        </p>

        <p className="my-2 text-3xl font-black tracking-tight">
          {currencyFormatter.format(receipt.amount)}
        </p>

        <div className="flex items-center justify-center gap-1.5">
          {isPaid ? (
            <CheckCircle2 className="size-4" strokeWidth={2.5} />
          ) : (
            <Clock3 className="size-4" strokeWidth={2.5} />
          )}

          <span className="text-xs font-bold">
            {isPaid ? "PAGAMENTO REGISTRADO" : "PAGAMENTO NÃO CONFIRMADO"}
          </span>
        </div>
      </section>

      {/* Detalhes */}
      <section className="mt-4 space-y-3 border-t border-dashed border-black pt-3">
        <div className="flex items-start gap-2">
          <CircleDollarSign className="mt-0.5 size-4 shrink-0" />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-600 uppercase">
              Forma de pagamento
            </p>
            <p className="wrap-break text-xs font-bold">
              {receipt.paymentMethod || "Não informada"}
            </p>
          </div>
        </div>

        {receipt.notes && (
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 size-4 shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-600 uppercase">Observações</p>
              <p className="wrap-break text-xs leading-relaxed">
                {receipt.notes}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Rodapé */}
      <footer className="mt-5 border-t-2 border-dashed border-black pt-3 text-center">
        <p className="text-xs font-bold">SISTEMA RANGOOO</p>

        <p className="text-[10px] text-gray-600">
          Gestão e vendas para o seu negócio.
        </p>

        <p className="text-[10px] font-medium">Obrigado pela parceria!</p>

        <div className="text-center text-[9px] text-gray-500">
          Documento gerado eletronicamente.
        </div>
      </footer>
    </div>
  )
}

export default ReceiptPrintTemplate
