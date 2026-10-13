import type { ReactNode } from "react"

type SubCardProps = {
  children: ReactNode
  className?: string
}

const SubCard = ({ children, className }: SubCardProps) => {
  return (
    <div
      className={`group ${className} min-h-10 w-full rounded-md border border-transparent bg-[#FFFDE7]/70 p-4 font-medium whitespace-nowrap transition-all outline-none hover:bg-[#FFFDE7] dark:border-transparent dark:bg-[#313030] dark:hover:bg-[#313030]/70`}
    >
      {children}
    </div>
  )
}

export default SubCard
