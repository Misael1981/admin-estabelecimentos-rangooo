export const dynamic = "force-dynamic"

import { getOrdersData } from "@/data/get-orders-data"
import { ConsumptionMethod } from "@misael1981/rangooo-database"
import { notFound } from "next/navigation"
import HeaderOrdersPage from "./components/HeaderOrdersPage"
import FilterConsumptionMethods from "./components/FilterConsumptionMethods"
import SearchOrder from "./components/SearchOrder"
import OrdersListWrapper from "./components/OrdersListWrapper"
import DeliveryEstimateSettings from "@/components/DeliveryEstimateSettings"
import { getDeliveryEstimateSettings } from "@/data/get-delivery-estimate-settings"

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
  let ordersToShow = orders

  if (sParams.query) {
    ordersToShow = orders.filter((order) =>
      order.orderNumber.toString().includes(sParams.query!),
    )
  }

  const deliveryEstimate = await getDeliveryEstimateSettings(restaurant.id)

  return (
    <div className="space-y-8">
      <HeaderOrdersPage totalOrders={orders.length} />

      <DeliveryEstimateSettings
        deliveryEstimate={deliveryEstimate}
        restaurantId={restaurant.id}
        slug={slug}
      />

      <FilterConsumptionMethods
        consumptionMethods={restaurant.consumptionMethods}
      />

      <SearchOrder />

      <OrdersListWrapper
        normalizedOrders={ordersToShow}
        key={ordersToShow.length}
        restaurantId={restaurant.id}
        slug={slug}
        restaurantName={restaurant.name}
      />
    </div>
  )
}
