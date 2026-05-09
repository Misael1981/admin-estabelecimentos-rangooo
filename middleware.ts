import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return (
        !!token && ["ADMIN", "RESTAURANT_OWNER"].includes(token.role as string)
      )
    },
  },
})

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
