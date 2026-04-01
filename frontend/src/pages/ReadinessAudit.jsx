import { useState } from 'react'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

export default function ReadinessAudit() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [form, setForm] = useState({
    has_accessibility_policy: false,
    remote_work_available: false,
    accommodation_budget: 'none',
    disability_training: false,
    accessible_workspace: false,
    flexible_hours: false
  })

  const toggle = (key) => setForm(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/employer/audit', form)
      setResult(res.data.data)
    } catch (err) {
      alert(err.response?.data?.error || 'Audit failed')
    } finally { setLoading(false) }
  }

  const gradeColor = { A: 'from-emerald-500 to-emerald-600', B: 'from-blue-500 to-blue-600', C: 'from-amber-500 to-amber-600', D: 'from-red-500 to-red-600' }
  const LABELS = {
    has_accessibility_policy: 'Accessibility Policy',
    remote_work_available: 'Remote Work Options',
    accommodation_budget: 'Accommodation Budget',
    disability_training: 'Disability Awareness Training',
    accessible_workspace: 'Accessible Physical Space',
    flexible_hours: 'Flexible Working Hours'
  }

  if (loading) return <div className="py-20"><Spinner size="xl" message="Computing readiness score..." /></div>

  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-[scale-in_0.5s_ease-out]">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-8 text-center">Readiness Audit Results</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-surface-100 p-8 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-primary-500)" strokeWidth="8"
                  strokeDasharray={`${(result.readiness_score / 100) * 264} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-display font-extrabold text-surface-900">{result.readiness_score}</span>
              </div>
            </div>
            <div className="text-sm text-surface-500">out of 100</div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-100 p-8 text-center flex flex-col items-center justify-center">
            <div className={`text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${gradeColor[result.grade] || gradeColor.D}`}>
              {result.grade}
            </div>
            <div className="text-sm text-surface-500 mt-2">
              {result.grade === 'A' ? 'Excellent!' : result.grade === 'B' ? 'Good Progress' : result.grade === 'C' ? 'Needs Improvement' : 'Action Required'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-surface-100 p-6">
            <h3 className="text-sm font-semibold text-emerald-700 mb-3">✓ Strengths</h3>
            <div className="space-y-2">
              {(result.strengths || []).map((s, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-emerald-50 text-sm text-emerald-700 font-medium">
                  {LABELS[s] || s}
                </div>
              ))}
              {result.strengths?.length === 0 && <p className="text-sm text-surface-400">No strengths identified yet</p>}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-surface-100 p-6">
            <h3 className="text-sm font-semibold text-amber-700 mb-3">⚠ Areas to Improve</h3>
            <div className="space-y-2">
              {(result.improvement_areas || []).map((s, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-amber-50 text-sm text-amber-700 font-medium">
                  {LABELS[s] || s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {result.recommendations?.length > 0 && (
          <div className="bg-white rounded-2xl border border-surface-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 border border-surface-100">
                  <span className="text-primary-500 font-bold mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-surface-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" onClick={() => setResult(null)} className="w-full">Retake Audit</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Employer Readiness Audit</h1>
      <p className="text-surface-500 mb-8">Answer 6 questions to receive your accessibility readiness score and recommendations.</p>

      <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { key: 'has_accessibility_policy', label: 'Does your company have a formal accessibility policy?', weight: 20, emoji: '📋' },
            { key: 'remote_work_available', label: 'Do you offer remote work options?', weight: 15, emoji: '🏠' },
            { key: 'disability_training', label: 'Do employees receive disability awareness training?', weight: 20, emoji: '🎓' },
            { key: 'accessible_workspace', label: 'Is your physical workspace accessible?', weight: 10, emoji: '♿' },
            { key: 'flexible_hours', label: 'Do you offer flexible working hours?', weight: 10, emoji: '⏰' }
          ].map(q => (
            <label key={q.key}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                ${form[q.key] ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{q.emoji}</span>
                <div>
                  <div className="text-sm font-medium text-surface-700">{q.label}</div>
                  <div className="text-xs text-surface-400">{q.weight} points</div>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" checked={form[q.key]} onChange={() => toggle(q.key)} className="sr-only" />
                <div className={`w-12 h-7 rounded-full transition-colors ${form[q.key] ? 'bg-primary-500' : 'bg-surface-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-1 ${form[q.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>
            </label>
          ))}

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-surface-700 mb-1">
              <span className="mr-2">💰</span>Annual Accommodation Budget
              <span className="text-xs text-surface-400 ml-2">(25 points)</span>
            </label>
            <select id="budget" value={form.accommodation_budget} onChange={e => setForm(prev => ({ ...prev, accommodation_budget: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400">
              <option value="none">No dedicated budget (0 pts)</option>
              <option value="under_5k">Under ₹5,00,000 (5 pts)</option>
              <option value="5k-20k">₹5,00,000 – ₹20,00,000 (15 pts)</option>
              <option value="over_20k">Over ₹20,00,000 (25 pts)</option>
            </select>
          </div>

          <Button type="submit" className="w-full" size="lg">Compute Readiness Score →</Button>
        </form>
      </div>
    </div>
  )
}
