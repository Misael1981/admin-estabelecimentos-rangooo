import { db } from "@rangooo/database"

export default async function Home() {
  const restaurants = await db.restaurant.findMany({
    take: 1,
  })
  console.log(restaurants)

  return (
    <div>
      <h1>Testando</h1>
    </div>
  )
}
