import { getRestaurantForPerfil } from "@/data/get-restaurant-for-perfil"
import { notFound } from "next/navigation"
import HeaderPerfil from "./components/HeaderPerfil/page"
import GeneralInformation from "./components/GeneralInformation"
import EstablishmentContacts from "./components/EstablishmentContacts"
import SocialMediaEstablishment from "./components/SocialMediaEstablishment"
import EstablishmentAddress from "./components/EstablishmentAddress"
import GalleryWithDescriptionEstablishment from "./components/GalleryWithDescriptionEstablishment"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PerfilPage({ params }: PageProps) {
  const { slug } = await params

  const restaurant = await getRestaurantForPerfil(slug)

  if (!restaurant) {
    return notFound()
  }

  const category = restaurant.category

  return (
    <div className="space-y-8">
      <HeaderPerfil />

      <GeneralInformation
        name={restaurant.name}
        slug={restaurant.slug}
        category={category}
        id={restaurant.id}
      />

      <EstablishmentContacts
        restaurantId={restaurant.id}
        initialContacts={restaurant.contacts}
      />

      <SocialMediaEstablishment
        initialSocialMedia={restaurant.socialMedia}
        initialEmail={restaurant.email || ""}
        restaurantId={restaurant.id}
      />

      <EstablishmentAddress
        restaurantId={restaurant.id}
        slug={slug}
        initialData={{
          street: restaurant.street ?? "",
          number: restaurant.number ?? "",
          neighborhood: restaurant.neighborhood ?? "",
          complement: restaurant.complement ?? "",
          city: restaurant.city ?? "",
          state: restaurant.state ?? "",
          zipCode: restaurant.zipCode ?? "",
          country: "Brasil",
        }}
      />

      <GalleryWithDescriptionEstablishment
        description={restaurant.description || ""}
        avatarImageUrl={restaurant.avatarImageUrl || ""}
        coverImageUrl={restaurant.coverImageUrl || ""}
        restaurantId={restaurant.id}
        slug={slug}
      />
    </div>
  )
}
