"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { register } from "@/lib/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function RegisterForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await register(formData)
    if (result?.user) {
      router.push("/dashboard")
      router.refresh()
    }
    return result
  }, null)

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start tracking your favorite series</p>

        <form action={action} className="auth-form">
          <Input
            id="username"
            name="username"
            type="text"
            label="Username"
            required
            minLength={3}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            minLength={6}
          />

          {state?.error && (
            <p className="auth-error">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} fullWidth>
            {pending ? "Creating..." : "Create Account"}
          </Button>

          <p className="auth-link">
            Already have an account?{" "}
            <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  )
}
