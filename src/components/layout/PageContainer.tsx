import { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  noNav?: boolean
  className?: string
}

export function PageContainer({ children, noNav = false, className = "" }: PageContainerProps) {
  return (
    <div className={`app ${noNav ? "page-no-nav" : ""} ${className}`}>
      {children}
    </div>
  )
}
