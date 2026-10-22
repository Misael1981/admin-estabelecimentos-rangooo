"use client"

import { useMemo } from "react"
import { MenuCategoryDTO } from "@/dtos/manual-order.dto"
import HeaderCard from "./components/HeaderCard"
import CustomerCard from "./components/CustomerCard"
import ItemsCard from "./components/ItemsCard"
import FooterCard from "./components/FooterCard"
import { buildMenuIndex } from "@/lib/pricing/build-menu-index"
import { DeliveryFees } from "@/dtos/delivery-fees.dto"

type Props = {
  menuCategories: MenuCategoryDTO[]
  deliveryFees: DeliveryFees
}

const OrderSummary = ({ menuCategories, deliveryFees }: Props) => {
  const { catalog, productsById } = useMemo(
    () => buildMenuIndex(menuCategories),
    [menuCategories],
  )

  return (
    <section className="bg-card mx-auto w-full max-w-3xl space-y-5 rounded-lg border p-5">
      <HeaderCard />
      <CustomerCard />
      <ItemsCard productsById={productsById} catalog={catalog} />
      <FooterCard catalog={catalog} deliveryFees={deliveryFees} />
    </section>
  )
}

export default OrderSummary
