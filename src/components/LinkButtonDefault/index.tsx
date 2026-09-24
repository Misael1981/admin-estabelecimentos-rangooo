import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

type LinkButtonDefaultProps = {
  url: string
  label: string
  icon?: React.ReactNode
}

const LinkButtonDefault = ({ url, label, icon }: LinkButtonDefaultProps) => {
  return (
    <Link href={url} className={buttonVariants({ variant: "default" })}>
      {icon}
      {label}
    </Link>
  )
}

export default LinkButtonDefault
