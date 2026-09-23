import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlanType } from "@/constants/enums"
import { replaceContractPlaceholders } from "@/constants/replace-contract-placeholders"

type CardCurrentContractProps = {
  data:
    | {
        establishment: null
        activeContract: null
        error: string
      }
    | {
        establishment: {
          name: string
          id: string
          plan: PlanType
          owner: {
            name: string
            id: string
          }
        }
        activeContract: {
          title: string
          id: string
          createdAt: Date
          updatedAt: Date
          version: string
          content: string
          isActive: boolean
        } | null
        error: null
      }
}

const CardCurrentContract = ({ data }: CardCurrentContractProps) => {
  // Guard clause que garante que temos estabelecimento e contrato ativo
  if (!data.establishment || !data.activeContract?.content) {
    return null
  }

  const { activeContract, establishment } = data

  const contentContract = replaceContractPlaceholders(
    activeContract.content,
    establishment,
  )
  const sanitizedContent = contentContract.replace(/&nbsp;/g, " ")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activeContract.title ?? "Contrato atual"}</CardTitle>

        <CardDescription>
          Versão {activeContract.version ?? "-"} •{" "}
          {activeContract.isActive ? "Ativo" : "Inativo"}
          {" • "}
          Última atualização:{" "}
          {new Date(activeContract.updatedAt).toLocaleDateString("pt-BR")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <section
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className="mt-2 w-full max-w-full text-sm leading-relaxed wrap-anywhere [&_h1]:mb-3 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_p]:mb-3 [&_p]:last:mb-0"
        />
      </CardContent>
    </Card>
  )
}

export default CardCurrentContract
