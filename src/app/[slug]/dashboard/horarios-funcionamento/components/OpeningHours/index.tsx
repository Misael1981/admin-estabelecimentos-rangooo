"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BusinessHoursFormData,
  businessHoursSchema,
} from "@/schemas/establishments-schemas"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { updateBusinessHours } from "@/app/actions/update-business-hours"
import DayCard from "../DayCard"

export interface TimeSlotDTO {
  type: "BREAKFAST" | "LUNCH" | "DINNER" | "SPECIAL"
  open: string
  close: string
}

type OpeningHoursProps = {
  slug: string
  restaurantId: string
  openingHours: {
    id: string
    dayOfWeek: number
    timeSlots: TimeSlotDTO[]
    isClosed: boolean
  }[]
}

const OpeningHours = ({
  slug,
  restaurantId,
  openingHours,
}: OpeningHoursProps) => {
  const formattedHours = useMemo(
    () =>
      (openingHours ?? [])
        .map((bh) => ({
          dayOfWeek: bh.dayOfWeek,
          isClosed: bh.isClosed,
          timeSlots: (bh.timeSlots as TimeSlotDTO[]) ?? [],
        }))
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek),
    [openingHours],
  )

  const defaultWeek = Array.from({ length: 7 }, (_, index) => ({
    dayOfWeek: index,
    isClosed: true,
    timeSlots: [],
  }))

  const mergedWeek = defaultWeek.map((defaultDay) => {
    const fromDb = formattedHours.find(
      (d) => d.dayOfWeek === defaultDay.dayOfWeek,
    )
    return fromDb ?? defaultDay
  })

  const methods = useForm<BusinessHoursFormData>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: {
      businessHours: mergedWeek,
    },
  })

  useEffect(() => {
    if (formattedHours.length > 0) {
      methods.reset({
        businessHours: formattedHours,
      })
    }
  }, [formattedHours, methods])

  const { isSubmitting } = methods.formState

  const onSubmit = async (data: BusinessHoursFormData) => {
    try {
      const result = await updateBusinessHours(slug, data, restaurantId)
      if (result.success) {
        toast.success("Horários atualizados com sucesso")
      } else {
        toast.error(result.error || "Falha ao atualizar horários")
      }
    } catch (err) {
      console.error(err)
      toast.error("Erro inesperado ao salvar horários")
    }
  }

  return (
    <Card className="w-full shadow-lg sm:max-w-md md:max-w-xl lg:max-w-2xl">
      <CardHeader>
        <CardTitle>Gerencie seu horários de funcionamento</CardTitle>
        <CardDescription>
          Lembre-se, fora do horário de funcionamento, os clientes não poderão
          fazer pedidos na sua página. Mantenha seus horários atualizados para
          garantir uma experiência positiva para seus clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            id="business-hours-form"
            className="space-y-4"
          >
            {methods.getValues("businessHours").map((_, dayIndex) => (
              <DayCard
                key={dayIndex}
                dayIndex={dayIndex}
                control={methods.control}
              />
            ))}
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button
          type="submit"
          form="business-hours-form"
          className="w-full min-w-32 md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Atualizando..." : "Atualizar Horários"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default OpeningHours
