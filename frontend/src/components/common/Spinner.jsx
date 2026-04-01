export default function Spinner({ size = 'md', message = '', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-4'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-label={message || 'Loading'}>
      <div className={`${sizes[size] || sizes.md} rounded-full border-primary-200 border-t-primary-500 animate-spin`} />
      {message && (
        <p className="text-sm text-surface-500 font-medium animate-pulse">{message}</p>
      )}
    </div>
  )
}
