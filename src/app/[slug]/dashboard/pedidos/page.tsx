import { getOrdersData } from "@/data/get-orders-data"
import { ConsumptionMethod } from "@misael1981/rangooo-database"
import { notFound } from "next/navigation"
import HeaderOrdersPage from "./components/HeaderOrdersPage"
import FilterConsumptionMethods from "./components/FilterConsumptionMethods"
import SearchOrder from "./components/SearchOrder"
import OrdersListWrapper from "./components/OrdersListWrapper"

interface OrdersPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    consumptionMethod?: string
    query?: string
  }>
}

export default async function OrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const { slug } = await params
  const sParams = await searchParams

  const methodFilter = Object.values(ConsumptionMethod).includes(
    sParams.consumptionMethod as ConsumptionMethod,
  )
    ? (sParams.consumptionMethod as ConsumptionMethod)
    : undefined

  const data = await getOrdersData(slug, methodFilter)
  if (!data || !data.restaurant) {
    return notFound()
  }

  const { restaurant, orders } = data

  // FILTRO DE BUSCA
  if (sParams.query) {
    const ordersFiltered = orders.filter((order) =>
      order.orderNumber.toString().includes(sParams.query!),
    )
  }

  return (
    <div className="space-y-8">
      <HeaderOrdersPage totalOrders={orders.length} />

      <FilterConsumptionMethods
        consumptionMethods={restaurant.consumptionMethods}
      />

      <SearchOrder />

      <OrdersListWrapper
        key={orders.length > 0 ? orders[0].id : "empty"}
        normalizedOrders={orders}
        restaurantId={restaurant.id}
        slug={slug}
      />
    </div>
  )
}
