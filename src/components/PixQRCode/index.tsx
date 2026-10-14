"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { generatePixPayload } from "@/utils/pix"
import { Button } from "../ui/button"

type PixQRCodeProps = {
  plan:
    | {
        price: number
        name: string
      }
    | undefined
}

const PixQRCode = ({ plan }: PixQRCodeProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(98.0)

  const pixPayload = generatePixPayload({
    key: "+5535999110933",
    name: "SISTEMA RANGOOO",
    city: "CONGONHAL",
    amount: selectedAmount,
    txid: "***",
  })

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-bold">Pagar Mensalidade do Rangooo</h2>

      {/* Botões para alternar os planos ou valor livre */}
      <div className="flex gap-2">
        <Button
          onClick={() => setSelectedAmount(98.0)}
          variant={selectedAmount === 98 ? "default" : "outline"}
        >
          Plano Básico (R$ 98)
        </Button>
        <Button
          onClick={() => setSelectedAmount(156.0)}
          variant={selectedAmount === 156 ? "default" : "outline"}
        >
          Plano Pro (R$ 156)
        </Button>
        <Button
          onClick={() => setSelectedAmount(undefined)}
          variant={selectedAmount === undefined ? "default" : "outline"}
        >
          Outro Valor
        </Button>
      </div>

      {/* QR Code gerado na hora */}
      <div className="rounded-xl border bg-white p-4">
        <QRCodeSVG value={pixPayload} size={220} level="M" marginSize={4} />
      </div>

      <p className="text-sm text-gray-500">
        {selectedAmount
          ? `Valor fixo: R$ ${selectedAmount.toFixed(2)}`
          : "Digite o valor no aplicativo do Itaú"}
      </p>
    </div>
  )
}

export default PixQRCode
