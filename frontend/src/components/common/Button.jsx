export default function Button({
  children, variant = 'primary', size = 'md', type = 'button',
  disabled = false, loading = false, fullWidth = false,
  className = '', onClick, ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:ring-3 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary-600 text-white shadow-glow hover:bg-primary-700 hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white text-surface-900 border border-surface-200 shadow-sm hover:bg-surface-50 hover:border-surface-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border-2 border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 hover:border-primary-600 hover:text-primary-700 hover:-translate-y-0.5 active:translate-y-0',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 active:bg-surface-200',
    accent: 'bg-accent-500 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:bg-accent-600 hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 active:translate-y-0',
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
    xl: 'px-9 py-4 text-lg gap-3',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
