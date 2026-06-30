import { Button } from "@/components/ui/button"
import Link from "next/link"

type PaginationButtonsProps = {
  queryParams: (novaPagina: number) => string
  pagination: {
    paginaAtual: number
    temPaginaAnterior: boolean
    temProximaPagina: boolean
  }
}

const PaginationButtons = ({
  queryParams,
  pagination,
}: PaginationButtonsProps) => {
  return (
    <section className="flex items-center justify-center gap-6 py-4">
      {/* Botão Anterior */}
      <Link
        href={queryParams(pagination.paginaAtual - 1)}
        className={
          !pagination.temPaginaAnterior ? "pointer-events-none opacity-50" : ""
        }
      >
        <Button variant="outline" disabled={!pagination.temPaginaAnterior}>
          Anterior
        </Button>
      </Link>

      {/* Botão Próximo */}
      <Link
        href={queryParams(pagination.paginaAtual + 1)}
        className={
          !pagination.temProximaPagina ? "pointer-events-none opacity-50" : ""
        }
      >
        <Button variant="outline" disabled={!pagination.temProximaPagina}>
          Próximo
        </Button>
      </Link>
    </section>
  )
}

export default PaginationButtons
