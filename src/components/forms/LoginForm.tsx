"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function LoginForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await login(formData)
    if (result?.user) {
      router.push("/dashboard")
      router.refresh()
    }
    return result
  }, null)

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue tracking your series</p>

        <form action={action} className="auth-form">
          <Input
            id="username"
            name="username"
            type="text"
            label="Username"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
          />

          {state?.error && (
            <p className="auth-error">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} fullWidth>
            {pending ? "Signing in..." : "Sign In"}
          </Button>

          <p className="auth-link">
            Don&apos;t have an account?{" "}
            <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  )
}
