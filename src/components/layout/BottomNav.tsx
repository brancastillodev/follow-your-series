"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface BottomNavProps {
  username: string
}

export function BottomNav({ username }: BottomNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard"
    return pathname.includes(path)
  }

  return (
    <nav className="bottom-nav">
      <Link
        href="/dashboard"
        className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
      >
        <span className="nav-icon">📺</span>
        <span className="nav-label">Series</span>
      </Link>
      <Link
        href="/dashboard#search"
        className={`nav-item ${isActive("#search") ? "active" : ""}`}
      >
        <span className="nav-icon">🔍</span>
        <span className="nav-label">Buscar</span>
      </Link>
      <Link
        href={`/profile/${username}`}
        className={`nav-item ${isActive("/profile") ? "active" : ""}`}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Perfil</span>
      </Link>
    </nav>
  )
}
