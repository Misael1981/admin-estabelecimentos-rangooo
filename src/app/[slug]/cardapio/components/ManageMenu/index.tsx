"use client"

import { useReducer } from "react"
import { MenuCategoryDTO } from "@/dtos/menu.dto"
import { menuReducer } from "@/reducers/menuReducer"
import MenuCategoriesList from "./components/MenuCategoriesList"
import SelectedTableName from "./components/SelectedTableName"
import AdditionalProductsCard from "./components/AdditionalProductsCard"
import ProductsListSession from "./components/ProductsListSession"

const ManageMenu = ({
  menuData,
  slug,
}: {
  menuData: MenuCategoryDTO[]
  slug: string
}) => {
  const [state, dispatch] = useReducer(menuReducer, {
    categories: menuData,
    selectedCategoryId: menuData[0]?.id ?? null,
  })

  if (!menuData || menuData.length === 0) {
    return <div>O cardápio ainda está sendo montado ou não existe.</div>
  }

  const handleSelectCategory = (id: string) => {
    dispatch({ type: "SELECT_CATEGORY", payload: id })
  }

  const handleDeleteCategory = (id: string) => {
    dispatch({ type: "REMOVE_CATEGORY", payload: id })
  }

  const categoriesSummary = menuData.map((cat) => ({
    id: cat.id,
    name: cat.name,
    productsCount: cat.products?.length ?? 0,
  }))

  const additionalProductsCategory = menuData.map((cat) => ({
    id: cat.id,
    name: cat.name,
    additionalProducts:
      cat.additionalIngredients?.map((ing) => ({
        ...ing,
        price: Number(ing.price),
      })) || [],
  }))

  const selectedCategory =
    additionalProductsCategory.find(
      (cat) => cat.id === state.selectedCategoryId,
    ) ?? null

  const productsCategory = menuData.map((cat) => ({
    id: cat.id,
    name: cat.name,
    products:
      cat.products?.map((prod) => ({
        ...prod,
        price: Number(prod.price),
      })) || [],
  }))

  const selectedProductsCategory =
    productsCategory.find((cat) => cat.id === state.selectedCategoryId) ?? null

  return (
    <div className="space-y-6">
      <MenuCategoriesList
        categories={categoriesSummary}
        onSelect={handleSelectCategory}
        onDelete={handleDeleteCategory}
        selectedCategoryId={state.selectedCategoryId ?? ""}
        slug={slug}
      />

      <SelectedTableName
        selectedCategoryId={state.selectedCategoryId ?? ""}
        categories={categoriesSummary}
      />

      <AdditionalProductsCard selectedCategory={selectedCategory} slug={slug} />

      <ProductsListSession
        selectedProductsCategory={selectedProductsCategory}
        slug={slug}
      />
    </div>
  )
}

export default ManageMenu
