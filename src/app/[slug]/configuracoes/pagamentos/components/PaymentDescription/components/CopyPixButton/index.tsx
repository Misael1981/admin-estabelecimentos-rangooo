"use client"

import { Button } from "@/components/ui/button"
import { generatePixPayload } from "@/utils/pix"
import { useMemo } from "react"
import { toast } from "sonner"

type CopyPixButtonProps = {
  plan: {
    price: number
    name: string
  }
}

const CopyPixButton = ({ plan }: CopyPixButtonProps) => {
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

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload)
    toast.success("Pix Copiado")
  }

  return <Button onClick={handleCopyPix}>Copiar código Pix</Button>
}

export default CopyPixButton
