import Link from "next/link"
import { verifySession } from "@/lib/auth"
import { Button } from "@/components/ui/Button"

export default async function Home() {
  const session = await verifySession()

  return (
    <div className="auth-page">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3rem", width: "100%", maxWidth: "24rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "1rem",
            background: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "white" }}>F</span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#dc2626" }}>Follow Your Series</h1>
          <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>Track your favorite series and anime</p>
        </div>

        {session ? (
          <Link href="/dashboard" style={{ width: "100%" }}>
            <Button fullWidth>Go to Dashboard</Button>
          </Link>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
            <Link href="/register" style={{ width: "100%" }}>
              <Button fullWidth>Create Account</Button>
            </Link>
            <Link href="/login" style={{ width: "100%" }}>
              <Button variant="secondary" fullWidth>Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
