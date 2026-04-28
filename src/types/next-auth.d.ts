import { DefaultSession } from "next-auth"
import { Role } from "@misael1981/rangooo-database"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      restaurantId?: string | null
      restaurantSlug?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: Role
    restaurantId?: string | null
  }
}
