import { prisma } from "@misael1981/rangooo-database"

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany({
    take: 1,
  })

  return (
    <div>
      <h1>{restaurants[0].name}</h1>
    </div>
  )
}
