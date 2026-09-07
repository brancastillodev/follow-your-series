import { HTMLAttributes } from "react"

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "pink" | "cyan" | "orange"
}

export function Tag({ variant = "default", className = "", children, ...props }: TagProps) {
  const variantClass = variant === "pink" ? "tag-pink" :
    variant === "cyan" ? "tag-cyan" :
    variant === "orange" ? "tag-orange" :
    "tag"

  return (
    <span className={`${variantClass} ${className}`} {...props}>
      {children}
    </span>
  )
}
