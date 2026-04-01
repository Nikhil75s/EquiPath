import { useState, useEffect } from 'react'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

const MOOD_EMOJIS = ['😢', '😟', '😐', '🙂', '😊']

export default function CareerPath() {
  const [loading, setLoading] = useState(true)
  const [careerPath, setCareerPath] = useState(null)
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [editTarget, setEditTarget] = useState('')

  useEffect(() => {
    api.get('/seeker/career-path')
      .then(res => {
        setCareerPath(res.data.data)
        setEditTarget(res.data.data?.targetRole || '')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const logWellness = async () => {
    setSaving(true)
    try {
      await api.post('/seeker/career-path/wellness', { mood, note })
      // Refresh
      const res = await api.get('/seeker/career-path')
      setCareerPath(res.data.data)
      setNote('')
    } catch {} finally { setSaving(false) }
  }

  const updateTarget = async () => {
    try {
      await api.put('/seeker/career-path', { targetRole: editTarget })
    } catch {}
  }

  if (loading) return <div className="py-20"><Spinner size="lg" message="Loading career path..." /></div>

  const checkins = careerPath?.wellnessCheckins || []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Career Path</h1>
      <p className="text-surface-500 text-sm mb-8">Track your career journey and wellness</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Career Goals */}
        <div className="bg-white rounded-2xl border border-surface-100 p-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Career Goals</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1 block">Current Role</label>
              <p className="text-surface-600 text-sm px-3 py-2 bg-surface-50 rounded-lg">
                {careerPath?.currentRole || 'Not set yet'}
              </p>
            </div>
            <div>
              <label htmlFor="target" className="text-sm font-medium text-surface-700 mb-1 block">Target Role</label>
              <div className="flex gap-2">
                <input id="target" type="text" value={editTarget} onChange={e => setEditTarget(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="e.g. Senior Data Analyst" />
                <Button size="sm" onClick={updateTarget}>Save</Button>
              </div>
            </div>
          </div>

          {/* Completed Courses */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Completed Courses</h3>
            {(careerPath?.completedCourses || []).length > 0 ? (
              <div className="space-y-2">
                {careerPath.completedCourses.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-sm text-surface-700">{c.name}</span>
                    <span className="text-xs text-surface-400 ml-auto">{c.platform}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-400 text-sm">No courses completed yet. Check the Skill Gap feature to find recommended courses!</p>
            )}
          </div>
        </div>

        {/* Wellness */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-surface-100 p-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Wellness Check-in</h2>
            <div className="flex justify-between mb-4">
              {MOOD_EMOJIS.map((emoji, i) => (
                <button key={i} onClick={() => setMood(i + 1)}
                  className={`text-2xl p-2 rounded-xl transition-all ${mood === i + 1 ? 'bg-primary-100 scale-125' : 'hover:bg-surface-100'}`}>
                  {emoji}
                </button>
              ))}
            </div>
            <textarea rows="2" value={note} onChange={e => setNote(e.target.value)}
              placeholder="How are you feeling about work today?"
              className="w-full px-3 py-2 rounded-lg border border-surface-200 text-sm resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-primary-100" />
            <Button size="sm" className="w-full" onClick={logWellness} disabled={saving}>
              {saving ? '...' : 'Log Today'}
            </Button>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl border border-surface-100 p-6">
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Recent Check-ins</h3>
            {checkins.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...checkins].reverse().slice(0, 10).map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 border border-surface-100">
                    <span className="text-lg">{MOOD_EMOJIS[(c.mood || 3) - 1]}</span>
                    <div className="flex-1">
                      {c.note && <p className="text-sm text-surface-700">{c.note}</p>}
                      <p className="text-xs text-surface-400 mt-1">
                        {c.date ? new Date(c.date).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-400 text-sm">No check-ins yet. Log your first one above!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
