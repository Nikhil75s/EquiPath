import { useState, useEffect, useCallback } from 'react'

let toastId = 0
let addToastGlobal = null

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    addToastGlobal = addToast
    return () => { addToastGlobal = null }
  }, [addToast])

  return { toasts, addToast, removeToast }
}

export function showToast(message, type = 'success') {
  if (addToastGlobal) addToastGlobal(message, type)
}

export default function ToastContainer({ toasts = [], removeToast }) {
  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          role="alert"
          onClick={() => removeToast?.(toast.id)}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium cursor-pointer
            animate-[slide-up_0.3s_ease-out] transition-all
            ${toast.type === 'success' ? 'bg-emerald-500 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-amber-500 text-white' : ''}
          `}
        >
          <span>
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && 'ℹ'}
            {toast.type === 'warning' && '⚠'}
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
