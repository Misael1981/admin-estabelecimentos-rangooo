import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@misael1981/rangooo-database"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true },
      })

      if (!dbUser || !["ADMIN", "RESTAURANT_OWNER"].includes(dbUser.role)) {
        return false
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          include: {
            restaurants: true,
          },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role

          if (dbUser.restaurants && dbUser.restaurants.length > 0) {
            session.user.restaurantId = dbUser.restaurants[0].id
            session.user.restaurantSlug = dbUser.restaurants[0].slug
          }
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
}
