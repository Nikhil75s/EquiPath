import { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label, name, type = 'text', error, hint,
  required = false, className = '', ...props
}, ref) {
  const id = props.id || `input-${name}`

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700">
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200
          ${error
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-200'
            : 'border-surface-200 bg-white focus:border-primary-400 focus:ring-primary-100'
          }
          focus:outline-none focus:ring-3
          placeholder:text-surface-400`}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-surface-500">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 flex items-center gap-1" role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
