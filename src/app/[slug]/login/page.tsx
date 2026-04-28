import CardForm from "@/components/CardForm"
import CardLogo from "@/components/CardLogo"

export default async function EstablishmentLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col rounded-xl border bg-white p-8 shadow-sm">
        <CardLogo />
        <CardForm />
      </div>
    </div>
  )
}
