import { OrderDTO } from "@/dtos/order.dto"
import { formatCurrency } from "@/helpers/format-currency"

type OrderPrintTemplateProps = {
  order: OrderDTO
}

const OrderItems = ({ order }: OrderPrintTemplateProps) => {
  return (
    <div className="space-y-3">
      {order.items.map((item, index) => (
        <div
          key={index}
          className="flex items-start justify-between gap-2 border-b border-dashed pb-2 last:border-0 last:pb-0"
        >
          <div className="">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  {item.category || "Geral"}
                </span>
                {item.isDouble ? (
                  <>
                    <div>
                      <span className="text-xl font-semibold">
                        1/2 {item.flavor1Name}
                      </span>
                      {item.flavor1additionalIngredients &&
                        item.flavor1additionalIngredients.length > 0 && (
                          <div className="mt-1 ml-5">
                            <span className="text-muted-foreground text-base">
                              +{" "}
                              {item.flavor1additionalIngredients
                                .map((ingredient) => ingredient.name)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      {item.flavor1Removed &&
                        item.flavor1Removed.length > 0 && (
                          <div className="mt-1 ml-5">
                            <span className="text-muted-foreground text-base">
                              - {item.flavor1Removed.join(", ")}
                            </span>
                          </div>
                        )}
                    </div>
                    <div>
                      <span className="text-xl font-semibold">
                        1/2 {item.flavor2Name}
                      </span>
                      {item.flavor2additionalIngredients &&
                        item.flavor2additionalIngredients.length > 0 && (
                          <div className="mt-1 ml-5">
                            <span className="text-muted-foreground text-base">
                              +{" "}
                              {item.flavor2additionalIngredients
                                .map((ingredient) => ingredient.name)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      {item.flavor2Removed &&
                        item.flavor2Removed.length > 0 && (
                          <div className="mt-1 ml-5">
                            <span className="text-muted-foreground text-base">
                              - {item.flavor2Removed.join(", ")}
                            </span>
                          </div>
                        )}
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {item.quantity}x
                      </span>
                      <span className="text-xl font-medium">{item.name}</span>
                    </div>
                    {item.additionalIngredients &&
                      item.additionalIngredients.length > 0 && (
                        <div className="mt-1 ml-5">
                          <span className="text-muted-foreground text-base">
                            + {item.additionalIngredients.join(", ")}
                          </span>
                        </div>
                      )}
                    {/* {item.removedIngredients &&
                                item.removedIngredients.length > 0 && (
                                  <div className="mt-1 ml-5">
                                    <span className="text-muted-foreground text-base">
                                      - {item.removedIngredients}
                                    </span>
                                  </div>
                                )} */}
                  </div>
                )}
              </div>
            </div>
            <div>
              <span>Preço total: </span>
              <span className="text-xl text-green-600">
                {formatCurrency(item.price)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderItems
