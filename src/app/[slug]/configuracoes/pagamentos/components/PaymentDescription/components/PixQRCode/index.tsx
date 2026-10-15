"use client"

import { useMemo } from "react"
import { QRCodeSVG } from "qrcode.react"
import { generatePixPayload } from "@/utils/pix"

type PixQRCodeProps = {
  plan: {
    price: number
    name: string
  }
}

const PixQRCode = ({ plan }: PixQRCodeProps) => {
  const pixPayload = useMemo(
    () =>
      generatePixPayload({
        key: process.env.NEXT_PUBLIC_PIX_KEY ?? "",
        name: "SISTEMA RANGOOO",
        city: "CONGONHAL",
        amount: plan.price,
        txid: "***",
      }),
    [plan.price],
  )

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl p-6 shadow-md">
      <div className="rounded-xl border bg-white p-4">
        <QRCodeSVG value={pixPayload} size={220} level="M" marginSize={4} />
      </div>

      <p className="text-sm text-gray-500">
        {plan.name}: R$ {plan.price.toFixed(2)}
      </p>
    </div>
  )
}

export default PixQRCode
