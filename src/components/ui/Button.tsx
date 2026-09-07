"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth = false, className = "", children, ...props }, ref) => {
    const variantClass = variant === "primary" ? "btn-primary" :
      variant === "secondary" ? "btn-secondary" :
      variant === "ghost" ? "btn-ghost" :
      "btn-danger"

    return (
      <button
        ref={ref}
        className={`${variantClass} ${fullWidth ? "full-width" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
