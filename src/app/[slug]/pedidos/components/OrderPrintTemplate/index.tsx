import { OrderDTO } from "@/dtos/order.dto"
import OrderItems from "./components/OrderItems"
import { METHOD_CONFIGS, paymentMethods } from "@/constants/maps-options"
import { formatDateWithDate } from "@/helpers/format-date-with-date"

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
      <h1 className="text-center text-2xl font-bold">{restauratName}</h1>
      <p className="text-center text-xl font-semibold">
        Pedido {order.orderNumber}
      </p>

      <hr className="my-2" />

      <p>Cliente: {order.customerName}</p>
      <p>Contato: {order.customerPhone}</p>
      <p>Hora: {formatDateWithDate(order.createdAt)}</p>

      <hr className="my-2" />

      <div className="avoid-break">
        <p className="text-end text-xl font-semibold">{methodConfig.label}</p>
        <OrderItems order={order} />
        <div>
          {order.method === "DELIVERY" && (
            <div>
              <span>Método de pagamento: </span>
              <span className="text-xl">
                {
                  paymentMethods[
                    order.paymentMethod as keyof typeof paymentMethods
                  ]
                }
              </span>
            </div>
          )}
        </div>
      </div>

      <hr className="my-2" />

      <div className="space-y-1">
        {order.method === "DELIVERY" && order.address && (
          <div>
            <p className="text-center text-xl">{order.address.street}</p>
            <p className="text-center text-xl">{order.address.number}</p>
            <p className="text-center text-xl">{order.address.neighborhood}</p>
          </div>
        )}
      </div>

      <div>
        {order.method === "PICKUP" && (
          <div>
            <p className="text-center text-xl">{order.customerName}</p>
            <p className="text-center text-xl">{order.customerPhone}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPrintTemplate
