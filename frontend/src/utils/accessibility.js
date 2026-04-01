/**
 * Accessibility utility functions for EquiPath
 */

/**
 * Announce message to screen readers via aria-live region
 */
export function announceToScreenReader(message, priority = 'polite') {
  const el = document.createElement('div')
  el.setAttribute('role', 'status')
  el.setAttribute('aria-live', priority)
  el.setAttribute('aria-atomic', 'true')
  el.className = 'sr-only'
  el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;'
  el.textContent = message
  document.body.appendChild(el)
  setTimeout(() => document.body.removeChild(el), 1000)
}

/**
 * Trap focus within a container element (for modals, dialogs)
 */
export function trapFocus(container) {
  const focusableSelectors = [
    'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
    'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
  ]
  const focusable = container.querySelectorAll(focusableSelectors.join(','))
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  function handleTab(e) {
    if (e.key !== 'Tab') return
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  container.addEventListener('keydown', handleTab)
  first?.focus()
  return () => container.removeEventListener('keydown', handleTab)
}

/**
 * Get contrast-safe color class for a score value
 */
export function getScoreColor(score) {
  if (score >= 80) return 'text-emerald-500'
  if (score >= 60) return 'text-primary-500'
  if (score >= 40) return 'text-amber-500'
  return 'text-red-500'
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Improvement'
}
