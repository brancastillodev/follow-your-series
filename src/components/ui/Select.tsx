import { SelectHTMLAttributes, forwardRef } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={id} className="form-label">{label}</label>
        )}
        <select
          ref={ref}
          id={id}
          className={`form-select ${error ? "form-input-error" : ""} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="form-error">{error}</span>}
      </div>
    )
  }
)

Select.displayName = "Select"
