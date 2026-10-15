"use client"

import { PaymentReceiptStatus } from "@/constants/enums"
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import ReceiptCard from "../ReceiptCard"
import ReceiptPrintTemplate from "../ReceiptPrintTemplate"

export type ReceiptDTO = {
  amount: number
  id: string
  status: PaymentReceiptStatus
  paymentMethod: string | null
  receiptNumber: number
  dueDate: Date
  paidAt: Date | null
  notes: string | null
}

type ListReceiptsProps = {
  receipts: ReceiptDTO[]
  establishmentName: string
}

const ListReceipts = ({ receipts, establishmentName }: ListReceiptsProps) => {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptDTO>()

  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  })

  useEffect(() => {
    if (selectedReceipt) {
      handlePrint()
    }
  }, [selectedReceipt, handlePrint])

  return (
    <>
      <section className="flex flex-wrap justify-center gap-4">
        {receipts.map((r) => (
          <ReceiptCard key={r.id} receipt={r} onPrint={setSelectedReceipt} />
        ))}
      </section>

      <div className="hidden">
        <div ref={printRef}>
          {selectedReceipt && (
            <ReceiptPrintTemplate
              receipt={selectedReceipt}
              establishmentName={establishmentName}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ListReceipts
