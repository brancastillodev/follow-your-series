interface LoadingProps {
  size?: "sm" | "md" | "lg"
}

export function Loading({ size = "md" }: LoadingProps) {
  return (
    <div className="loading">
      <div className="spinner" style={{
        width: size === "sm" ? "1rem" : size === "lg" ? "2rem" : "1.5rem",
        height: size === "sm" ? "1rem" : size === "lg" ? "2rem" : "1.5rem"
      }} />
    </div>
  )
}
