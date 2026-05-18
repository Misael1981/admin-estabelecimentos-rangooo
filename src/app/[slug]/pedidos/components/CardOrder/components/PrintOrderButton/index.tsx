"use client"

import { Button } from "@/components/ui/button"
import { OrderDTO } from "@/dtos/order.dto"
import { useThermalPrint } from "@/hooks/use-thermal-print"
import { generateThermalReceiptHtml } from "@/lib/thermal-receipt-generator"
import { Printer } from "lucide-react"

interface PrintOrderButtonProps {
  order: OrderDTO
  restaurantName?: string | undefined
  paperWidth?: "58mm" | "80mm"
  className?: string
}

const PrintOrderButton = ({
  order,
  restaurantName,
  paperWidth = "80mm",
  className,
}: PrintOrderButtonProps) => {
  const { print } = useThermalPrint({
    paperWidth,
    onBeforePrint: () => console.log("Imprimindo pedido #", order.orderNumber),
    onAfterPrint: () => console.log("Impressão concluída"),
  })

  function handlePrint() {
    const html = generateThermalReceiptHtml(order, restaurantName)
    print(html)
  }

  return (
    <Button onClick={handlePrint} className={className ?? "w-full sm:w-fit"}>
      <Printer className="mr-2 h-4 w-4" />
      Imprimir Pedido
    </Button>
  )
}

export default PrintOrderButton
