import { OrderDTO } from "@/dtos/order.dto"

type OrderPrintTemplateProps = {
  order: OrderDTO
}

const OrderPrintTemplate = ({ order }: OrderPrintTemplateProps) => {
  return (
    <div className="print-container">
      <h1 className="text-center text-xl font-bold">RANGOOO</h1>

      <hr className="my-2" />

      <p>Cliente: Chicó</p>

      <hr className="my-2" />

      <div className="avoid-break">
        <p>1x X-Burger</p>
        <p>R$ 25,00</p>
      </div>

      <hr className="my-2" />

      <p>Total: R$ 25,00</p>
    </div>
  )
}

export default OrderPrintTemplate
