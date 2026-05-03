import { OrderDTO } from "@/dtos/order.dto"
import type {
  ConsumptionMethod,
  OrderStatus,
  PlanType,
} from "@misael1981/rangooo-database"
import {
  CheckCircle,
  ChefHat,
  Clock,
  LucideIcon,
  Motorbike,
  Package,
  Truck,
  UtensilsCrossed,
  XCircle,
} from "lucide-react"

interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: LucideIcon
  label: string
  color: string
}

export const STATUS_CONFIGS: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    variant: "secondary",
    icon: Clock,
    label: "Pendente",
    color: "text-pink-800 bg-pink-200",
  },
  CONFIRMED: {
    variant: "default",
    icon: CheckCircle,
    label: "Confirmado",
    color: "text-blue-600 bg-blue-50",
  },
  PREPARING: {
    variant: "default",
    icon: ChefHat,
    label: "Em Preparo",
    color: "text-orange-600 bg-orange-50",
  },
  OUT_FOR_DELIVERY: {
    variant: "default",
    icon: Motorbike,
    label: "Saiu para a entrega",
    color: "text-yellow-600 bg-yellow-50",
  },
  DELIVERED: {
    variant: "default",
    icon: CheckCircle,
    label: "Entregue",
    color: "text-green-600 bg-green-50",
  },
  CANCELED: {
    variant: "destructive",
    icon: XCircle,
    label: "Cancelado",
    color: "text-red-600 bg-red-50",
  },
}

export interface CardOrderProps {
  order: OrderDTO
  slug?: string
}

export const RestaurantCategory = [
  "RESTAURANT",
  "PIZZARIA",
  "HAMBURGUERIA",
  "SORVETERIA",
  "ADEGA",
] as const

export const CATEGORY_LABELS: Record<
  (typeof RestaurantCategory)[number],
  string
> = {
  RESTAURANT: "Restaurante",
  PIZZARIA: "Pizzaria",
  HAMBURGUERIA: "Hamburgueria",
  SORVETERIA: "Sorveteria",
  ADEGA: "Adega",
}

export interface MethodConfig {
  icon: LucideIcon
  label: string
  color: string
}

export const METHOD_CONFIGS: Record<ConsumptionMethod, MethodConfig> = {
  DELIVERY: { icon: Truck, label: "Entrega", color: "text-blue-600" },
  PICKUP: { icon: Package, label: "Retirada", color: "text-green-600" },
  DINE_IN: { icon: UtensilsCrossed, label: "Mesa", color: "text-purple-600" },
}

export type PlanDetail = {
  id: PlanType
  title: string
  description: string
  features: string[] // Dica: adicionei isso pra você listar os benefícios!
}

export const PLANS_DETAILS: PlanDetail[] = [
  {
    id: "BASICO",
    title: "Plano Básico",
    description:
      "Ideal para estabelecimentos que estão começando e desejam uma presença online simples. Inclui recursos essenciais para gerenciar seu cardápio, pedidos e clientes.",
    features: ["Cardápio Digital", "Gestão de Pedidos", "Entrega Própria"],
  },
  {
    id: "PRO",
    title: "Plano Pro",
    description:
      "Nesse plano o estabelecimento tem acesso às entregas do Rangooo Entregas. O pedido chega direto para nossos entregadores parceiros, que cuidam de tudo para você.",
    features: ["Tudo do Básico", "Logística Rangooo", "Maior Visibilidade"],
  },
]
