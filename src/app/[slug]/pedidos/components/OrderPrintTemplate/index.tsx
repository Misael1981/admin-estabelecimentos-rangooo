import { OrderDTO } from "@/dtos/order.dto"
import OrderItems from "./components/OrderItems"
import { METHOD_CONFIGS, paymentMethods } from "@/constants/maps-options"

type OrderPrintTemplateProps = {
  order: OrderDTO
  restauratName: string
}

const OrderPrintTemplate = ({
  order,
  restauratName,
}: OrderPrintTemplateProps) => {
  const methodConfig = METHOD_CONFIGS[order.method!]
  return (
    <div className="print-container">
      <h1 className="text-center text-xl font-bold">{restauratName}</h1>

      <hr className="my-2" />

      <p>Cliente: {order.customerName}</p>
      <p>Contato: {order.customerPhone}</p>

      <hr className="my-2" />

      <div className="avoid-break">
        <span>{methodConfig.label}</span>
        <OrderItems order={order} />
        <div>
          <span>Método de pagamento: </span>
          <span className="text-xl">
            {paymentMethods[order.paymentMethod as keyof typeof paymentMethods]}
          </span>
        </div>
      </div>

      <hr className="my-2" />

      <div className="space-y-1">
        <p className="text-sm font-medium">
          {order.customerName || "Cliente"}
          {order.customerPhone && ` - ${order.customerPhone}`}
        </p>
        {order.method === "DELIVERY" && order.address && (
          <p className="">
            {order.address.street}, {order.address.number},{" "}
            {order.address.neighborhood}
          </p>
        )}
      </div>
    </div>
  )
}

export default OrderPrintTemplate
