import { TextareaHTMLAttributes, forwardRef } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={id} className="form-label">{label}</label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`form-textarea ${error ? "form-input-error" : ""} ${className}`}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"
