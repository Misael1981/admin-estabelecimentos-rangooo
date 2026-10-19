"use client"

import Image from "next/image"
import { ImageOff, Tag } from "lucide-react"

import { ProductDTO } from "@/dtos/manual-order.dto"

type ProductCardProps = {
  product: ProductDTO
  isSelected: boolean
  onSelect: () => void
  disabled: boolean
}

const ProductCard = ({
  product,
  isSelected,
  onSelect,
  disabled,
}: ProductCardProps) => {
  const ingredientsText =
    Array.isArray(product.ingredients) && product.ingredients.length > 0
      ? product.ingredients.filter(Boolean).join(", ")
      : ""

  return (
    <article
      className={[
        "group flex w-full flex-1 cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 sm:flex-row",
        isSelected
          ? "border-amber-600 shadow-md ring-2 ring-amber-200"
          : "border-border hover:border-primary/30 hover:shadow-md",
        disabled && !isSelected ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
      onClick={disabled ? undefined : onSelect}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !disabled) {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      {/* Imagem do produto */}
      <div className="bg-muted relative h-48 shrink-0 overflow-hidden sm:h-auto sm:min-h-40 sm:w-44 lg:w-52">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-40 items-center justify-center">
            <ImageOff className="text-muted-foreground/40 size-10" />
          </div>
        )}

        <span className="text-muted-foreground absolute top-3 left-3 rounded-md border bg-white/95 px-2 py-1 text-xs font-medium shadow-sm">
          Produto
        </span>
      </div>

      {/* Informações */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 lg:p-5">
        <div className="space-y-2">
          <h3 className="text-foreground text-base leading-snug font-semibold lg:text-lg">
            {product.name}
          </h3>

          {ingredientsText && (
            <div className="flex min-h-15 items-start gap-2 pt-1">
              <Tag className="text-muted-foreground mt-0.5 size-4 shrink-0" />

              <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                {ingredientsText}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t pt-3">
          <div>
            <p className="text-muted-foreground text-xs font-medium">
              Preço de venda
            </p>

            <p className="text-xl font-bold tracking-tight text-green-600 lg:text-2xl">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
