import { ReactNode } from "react"

interface AppHeaderProps {
  children?: ReactNode
  right?: ReactNode
}

export function AppHeader({ children, right }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        {children}
      </div>
      {right && <div className="header-right">{right}</div>}
    </header>
  )
}
