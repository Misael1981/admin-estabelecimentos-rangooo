import { OrderAddress } from "@/dtos/order.dto"
import { AreaType } from "@misael1981/rangooo-database"

export function parseAddress(address: unknown): OrderAddress | undefined {
  if (!address || typeof address !== "object" || Array.isArray(address)) {
    return undefined
  }

  const a = address as Record<string, unknown>

  if (typeof a.street === "string" && typeof a.number === "string") {
    return {
      street: a.street,
      number: a.number,
      city: typeof a.city === "string" ? a.city : "",
      neighborhood:
        typeof a.neighborhood === "string" ? a.neighborhood : undefined,
      complement: typeof a.complement === "string" ? a.complement : undefined,
      reference: typeof a.reference === "string" ? a.reference : undefined,
      areaType:
        typeof a.areaType === "string" ? (a.areaType as AreaType) : undefined,
    }
  }

  return undefined
}
