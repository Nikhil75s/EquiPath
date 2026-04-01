import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/common/Button'
import SkillTagInput from '../components/common/SkillTagInput'
import Spinner from '../components/common/Spinner'
import SpeechInput from '../components/common/SpeechInput'

export default function PostJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: [], workMode: 'remote',
    salaryRange: '', isAnonymousHiring: true,
    requiredAbilities: { seated_work: true, screen_reader_compatible: false, written_communication: false, no_time_pressure: false, remote_tools: true, flexible_schedule: false }
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const toggleAbility = (key) => setForm(prev => ({
    ...prev,
    requiredAbilities: { ...prev.requiredAbilities, [key]: !prev.requiredAbilities[key] }
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/employer/jobs', form)
      navigate('/dashboard/employer')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job')
    } finally { setLoading(false) }
  }

  const ABILITIES = [
    { key: 'seated_work', label: 'Seated Work Friendly', emoji: '🪑' },
    { key: 'screen_reader_compatible', label: 'Screen Reader Compatible', emoji: '🖥️' },
    { key: 'written_communication', label: 'Written Communication', emoji: '✍️' },
    { key: 'no_time_pressure', label: 'No Time Pressure', emoji: '⏰' },
    { key: 'remote_tools', label: 'Remote Tools', emoji: '🏠' },
    { key: 'flexible_schedule', label: 'Flexible Schedule', emoji: '📅' }
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Post a New Job</h1>
      <p className="text-surface-500 mb-8">Create an inclusive job posting that matches candidates by abilities.</p>

      <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6 sm:p-8">
        {error && <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-surface-700 mb-1">Job Title *</label>
            <input id="title" type="text" value={form.title} onChange={e => update('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400"
              placeholder="e.g. Data Analyst" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="desc" className="block text-sm font-medium text-surface-700">Description *</label>
              <SpeechInput onTranscript={(text) => update('description', form.description ? `${form.description} ${text}` : text)} />
            </div>
            <textarea id="desc" rows="6" value={form.description} onChange={e => update('description', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400 resize-none"
              placeholder="Describe the role and responsibilities..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Required Skills</label>
            <SkillTagInput skills={form.requiredSkills} onChange={s => update('requiredSkills', s)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">Workplace Accommodations</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ABILITIES.map(ab => (
                <label key={ab.key} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm
                  ${form.requiredAbilities[ab.key] ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}>
                  <input type="checkbox" checked={form.requiredAbilities[ab.key]} onChange={() => toggleAbility(ab.key)} className="sr-only" />
                  <span>{ab.emoji}</span>
                  <span className="text-xs font-medium">{ab.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset>
              <legend className="block text-sm font-medium text-surface-700 mb-2">Work Mode</legend>
              <div className="grid grid-cols-3 gap-2">
                {['remote', 'hybrid', 'onsite'].map(mode => (
                  <label key={mode} className={`flex items-center justify-center p-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium
                    ${form.workMode === mode ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 text-surface-600'}`}>
                    <input type="radio" name="workMode" value={mode} checked={form.workMode === mode} onChange={() => update('workMode', mode)} className="sr-only" />
                    {mode === 'remote' ? '🏠' : mode === 'hybrid' ? '🔄' : '🏢'} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-surface-700 mb-1">Salary Range</label>
              <select id="salary" value={form.salaryRange} onChange={e => update('salaryRange', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400">
                <option value="">Select...</option>
                <option value="Under ₹3L">Under ₹3L</option>
                <option value="₹3L–6L">₹3L–6L</option>
                <option value="₹6L–10L">₹6L–10L</option>
                <option value="₹10L–20L">₹10L–20L</option>
                <option value="₹20L+">₹20L+</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 border border-primary-100 cursor-pointer">
            <input type="checkbox" checked={form.isAnonymousHiring} onChange={e => update('isAnonymousHiring', e.target.checked)}
              className="w-4 h-4 rounded accent-primary-500" />
            <div>
              <div className="text-sm font-medium text-primary-700">Anonymous Hiring</div>
              <div className="text-xs text-primary-600">Candidate disability info is hidden during screening</div>
            </div>
          </label>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Post Job →'}
          </Button>
        </form>
      </div>
    </div>
  )
}
