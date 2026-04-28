import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // Onde você definiu as opções
import { prisma } from "@misael1981/rangooo-database"
import { redirect } from "next/navigation"
import Link from "next/link"
import CardLogo from "@/components/CardLogo"
import CardForm from "@/components/CardForm"

export default async function RootPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1>Rangooo Central Admin</h1>
        <p>Acesso restrito a administradores.</p>
        <div className="flex flex-col rounded-xl border bg-white p-8 shadow-sm">
          <CardLogo />
          <CardForm />
        </div>
      </div>
    )
  }

  if (session.user.role === "ADMIN") {
    const restaurants = await prisma.restaurant.findMany({
      select: { name: true, slug: true },
    })

    return (
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">
          Olá, Misael! Qual loja vamos gerenciar hoje?
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {restaurants.map((res) => (
            <Link
              key={res.slug}
              href={`/${res.slug}/dashboard`}
              className="rounded-lg border p-4 transition-colors hover:bg-orange-50"
            >
              <h2 className="font-semibold">{res.name}</h2>
              <p className="text-sm text-gray-500">Acessar painel →</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  if (session.user.role === "RESTAURANT_OWNER" && session.user.restaurantSlug) {
    redirect(`/${session.user.restaurantSlug}/dashboard`)
  }

  return <div>Acesso não autorizado.</div>
}
