"use client"

import { Button } from "@/components/ui/button"
import { AreaType, ConsumptionMethod } from "@/constants/enums"
import {
  ManualOrderFormInput,
  ManualOrderFormValue,
  manualOrderSchema,
} from "@/schemas/manual-order.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import ConsumptionMethodFields from "./components/ConsumptionMethodFields"
import PickupFields from "./components/PickupFields"
import DeliveryFields from "./components/DeliveryFields"
import { AnimatePresence, motion } from "framer-motion"
import DineInFields from "./components/DineInFields"
import { CustomerDTO, MenuCategoryDTO } from "@/dtos/manual-order.dto"
import SearchCustomer from "../SearchCustomer"
import OrderItemsBuilder from "./components/OrderItemsBuilder"

type ManualOrderFormProps = {
  establishment: {
    menuCategories: MenuCategoryDTO[]
    name: string
    id: string
    slug: string
    consumptionMethods: {
      id: string
      method: ConsumptionMethod
      isActive: boolean
    }[]
    customers: CustomerDTO[]
  }
}

const ManualOrderForm = ({ establishment }: ManualOrderFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const requestedMethod = searchParams.get("consumptionMethod")

  const activeMethods = establishment.consumptionMethods.filter(
    (method) => method.isActive,
  )

  const defaultConsumptionMethod = (activeMethods[0]?.method ??
    "DELIVERY") as ManualOrderFormValue["consumptionMethod"]

  const emptyAddress = {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    reference: "",
  }

  const methods = useForm<ManualOrderFormInput, unknown, ManualOrderFormValue>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: {
      consumptionMethod: defaultConsumptionMethod,

      // Itens e observações (comuns aos 3 métodos)
      items: [],
      notes: "",

      // Cliente (DELIVERY e PICKUP)
      customerName: "",
      customerPhone: "",
      customerCode: undefined,

      // PICKUP
      pickupTime: "",

      // DINE_IN
      tableNumber: "",
      peopleCount: undefined,

      // DELIVERY
      areaType: AreaType.URBAN,
      address: emptyAddress,
    },
  })

  const { handleSubmit, setValue, watch } = methods

  const handleSelectCustomer = (customer: CustomerDTO) => {
    setValue("customerName", customer.name, { shouldValidate: true })
    setValue("customerPhone", customer.phone ?? "", { shouldValidate: true })
    setValue("customerCode", customer.customerCode)

    const address = customer.addresses[0]

    setValue(
      "address",
      address
        ? {
            street: address.street,
            number: address.number,
            complement: address.complement ?? "",
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            reference: address.reference ?? "",
          }
        : emptyAddress,
      { shouldValidate: true },
    )

    setValue("areaType", address?.areaType ?? AreaType.URBAN, {
      shouldValidate: true,
    })
  }

  const handleClearCustomer = () => {
    setValue("customerName", "")
    setValue("customerPhone", "")
    setValue("customerCode", undefined as never)
    setValue("address", emptyAddress)
    setValue("areaType", AreaType.URBAN)
  }

  const selectedMethod: ManualOrderFormValue["consumptionMethod"] =
    activeMethods.some((method) => method.method === requestedMethod)
      ? (requestedMethod as ManualOrderFormValue["consumptionMethod"])
      : defaultConsumptionMethod

  useEffect(() => {
    setValue("consumptionMethod", selectedMethod, {
      shouldValidate: true,
    })
  }, [selectedMethod, setValue])

  // eslint-disable-next-line
  const consumptionMethod = watch("consumptionMethod")

  const onSubmit = async (data: ManualOrderFormInput) => {
    startTransition(async () => {
      try {
        toast.success("Pedido efetuado com sucesso!")
        console.log("Pedido efetuado: ", data)
        router.push(`/${establishment.slug}/pedidos`)
      } catch (error) {
        console.error("Erro ao registrar pedido:", error)
        toast.error("Ocorreu um erro ao registrar pedido.")
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <ConsumptionMethodFields
          consumptionMethods={establishment.consumptionMethods}
          slug={establishment.slug}
        />

        {consumptionMethod !== ConsumptionMethod.DINE_IN && (
          <section className="flex flex-col items-center gap-2">
            <h3 className="px-5 pt-2 text-center text-2xl font-semibold">
              Buscar Clientes
            </h3>
            <SearchCustomer
              customers={establishment.customers}
              onSelect={handleSelectCustomer}
              onClear={handleClearCustomer}
            />
          </section>
        )}

        <AnimatePresence mode="wait">
          {consumptionMethod === ConsumptionMethod.DINE_IN && (
            <motion.div
              key="dine-in"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <DineInFields />
            </motion.div>
          )}
          {consumptionMethod === ConsumptionMethod.DELIVERY && (
            <motion.div
              key="delivery"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <DeliveryFields />
            </motion.div>
          )}
          {consumptionMethod === ConsumptionMethod.PICKUP && (
            <motion.div
              key="pickup"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <PickupFields />
            </motion.div>
          )}
        </AnimatePresence>

        <OrderItemsBuilder menuCategories={establishment.menuCategories} />

        <div className="flex w-full justify-center">
          <Button
            className="w-full max-w-xl"
            type="submit"
            size="lg"
            disabled={isPending}
          >
            {isPending ? "Salvando..." : "Criar Pedido"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default ManualOrderForm
