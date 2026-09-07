"use client"

import { useRouter } from "next/navigation"
import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/Button"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  )
}
