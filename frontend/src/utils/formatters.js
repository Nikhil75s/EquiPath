/**
 * Formatting utility functions for EquiPath
 */

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function formatMatchScore(score) {
  if (score === null || score === undefined) return '—'
  return `${Math.round(score * 100)}%`
}

export function formatScoreBadge(score) {
  const pct = Math.round(score * 100)
  if (pct >= 80) return { text: `${pct}%`, color: 'bg-emerald-100 text-emerald-700' }
  if (pct >= 60) return { text: `${pct}%`, color: 'bg-blue-100 text-blue-700' }
  if (pct >= 40) return { text: `${pct}%`, color: 'bg-amber-100 text-amber-700' }
  return { text: `${pct}%`, color: 'bg-red-100 text-red-700' }
}

export function formatGrade(grade) {
  const colors = {
    'A': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'B': 'bg-blue-100 text-blue-700 border-blue-200',
    'C': 'bg-amber-100 text-amber-700 border-amber-200',
    'D': 'bg-orange-100 text-orange-700 border-orange-200',
    'F': 'bg-red-100 text-red-700 border-red-200',
  }
  return colors[grade] || 'bg-gray-100 text-gray-700'
}

export function formatStatus(status) {
  const map = {
    'applied': { text: 'Applied', color: 'bg-blue-100 text-blue-700' },
    'shortlisted': { text: 'Shortlisted', color: 'bg-emerald-100 text-emerald-700' },
    'interview': { text: 'Interview', color: 'bg-purple-100 text-purple-700' },
    'offer': { text: 'Offer', color: 'bg-green-100 text-green-700' },
    'rejected': { text: 'Rejected', color: 'bg-red-100 text-red-700' },
  }
  return map[status] || { text: status, color: 'bg-gray-100 text-gray-700' }
}

export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
}
