interface AvatarProps {
  username: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Avatar({ username, size = "md", className = "" }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase()
  const sizeClass = size === "sm" ? "avatar-sm" :
    size === "lg" ? "avatar-lg" :
    ""

  return (
    <div className={`avatar ${sizeClass} ${className}`}>
      {initial}
    </div>
  )
}
