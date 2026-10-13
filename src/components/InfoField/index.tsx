import { ReactNode } from "react"

interface InfoFieldProps {
  label: string
  value?: string | number | ReactNode | null
  className?: string
  classNameValue?: string
}

const InfoField = ({
  className,
  label,
  value,
  classNameValue,
}: InfoFieldProps) => {
  return (
    <div className={`space-y-1 ${className || ""}`}>
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
        {label}
      </span>
      <p
        className={`text-foreground text-sm font-semibold ${classNameValue || ""}`}
      >
        {value || "—"}
      </p>
    </div>
  )
}

export default InfoField
