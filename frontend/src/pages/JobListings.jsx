import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import Modal from '../components/common/Modal'

export default function JobListings() {
  const { profile } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [filter, setFilter] = useState({ workMode: 'all', minMatch: 0 })
  const [gapModal, setGapModal] = useState({ open: false, jobId: null, data: null, loading: false })

  const assessmentDone = profile?.assessment_done

  useEffect(() => {
    if (!assessmentDone) { setLoading(false); return }
    fetchJobs()
    fetchApplications()
  }, [assessmentDone])

  const fetchJobs = async () => {
    try {
      const res = await api.get('/seeker/jobs')
      setJobs(res.data.data?.matches || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchApplications = async () => {
    try {
      const res = await api.get('/seeker/applications')
      const ids = new Set((res.data.data || []).map(a => a.job_id))
      setAppliedJobs(ids)
    } catch (err) {}
  }

  const handleApply = async (jobId) => {
    setApplying(jobId)
    try {
      await api.post(`/seeker/jobs/${jobId}/apply`)
      setAppliedJobs(prev => new Set([...prev, jobId]))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply')
    } finally { setApplying(null) }
  }

  const openSkillGap = async (jobId) => {
    setGapModal({ open: true, jobId, data: null, loading: true })
    try {
      const res = await api.get(`/seeker/jobs/${jobId}/gap`)
      setGapModal(prev => ({ ...prev, data: res.data.data, loading: false }))
    } catch (err) {
      setGapModal(prev => ({ ...prev, loading: false }))
    }
  }

  const filtered = jobs.filter(j => {
    if (filter.workMode !== 'all' && j.work_mode !== filter.workMode) return false
    const score = j.match_score || 0
    if (score * 100 < filter.minMatch) return false
    return true
  })

  const scoreBadge = (score) => {
    const pct = Math.round((score || 0) * 100)
    const color = pct >= 70 ? 'bg-emerald-100 text-emerald-700' : pct >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-surface-100 text-surface-600'
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${color}`}>{pct}% Match</span>
  }

  if (!assessmentDone) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <h2 className="text-xl font-display font-bold text-surface-900 mb-3">Complete Your Assessment First</h2>
          <p className="text-surface-500 mb-6">Take a 5-minute functional ability assessment to see AI-matched jobs.</p>
          <Link to="/assessment"><Button size="lg">Start Assessment →</Button></Link>
        </div>
      </div>
    )
  }

  if (loading) return <div className="py-20"><Spinner size="lg" message="Finding your best matches..." /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">AI-Matched Jobs</h1>
          <p className="text-surface-500 text-sm">{filtered.length} jobs matched to your profile</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filter.workMode} onChange={e => setFilter(prev => ({ ...prev, workMode: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-surface-200 text-sm">
            <option value="all">All Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-surface-600">
            <span>Min:</span>
            <input type="range" min="0" max="100" value={filter.minMatch}
              onChange={e => setFilter(prev => ({ ...prev, minMatch: parseInt(e.target.value) }))}
              className="w-24 accent-primary-500" />
            <span className="font-bold text-primary-600">{filter.minMatch}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map(job => (
          <div key={job.id} className="bg-white rounded-xl border border-surface-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-surface-900">{job.title}</h3>
                  {scoreBadge(job.match_score)}
                </div>
                <p className="text-sm text-surface-500 mb-1">{job.company_name}</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    job.work_mode === 'remote' ? 'bg-emerald-100 text-emerald-700' :
                    job.work_mode === 'hybrid' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>{job.work_mode}</span>
                  {job.salary_range && <span className="text-xs text-surface-500">{job.salary_range}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(job.required_skills || []).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 text-xs">{s}</span>
                  ))}
                </div>
                {job.match_factors?.length > 0 && (
                  <p className="text-xs text-primary-600 mt-2">Matched: {job.match_factors.join(', ')}</p>
                )}
              </div>
              <div className="flex sm:flex-col gap-2">
                {appliedJobs.has(job.id) ? (
                  <span className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-medium">✓ Applied</span>
                ) : (
                  <Button size="sm" onClick={() => handleApply(job.id)} disabled={applying === job.id}>
                    {applying === job.id ? '...' : 'Apply'}
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => openSkillGap(job.id)}>Skill Gap</Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-surface-400">No jobs match your current filters.</div>
        )}
      </div>

      {/* Skill Gap Modal */}
      {gapModal.open && (
        <Modal onClose={() => setGapModal({ open: false, jobId: null, data: null, loading: false })} title="Skill Gap Analysis">
          {gapModal.loading ? (
            <Spinner size="md" message="Analyzing skill gap..." />
          ) : gapModal.data ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-surface-900">{gapModal.data.gap_percentage || Math.round((gapModal.data.gap_score || 0) * 100)}%</div>
                  <div className="text-xs text-surface-500">Gap</div>
                </div>
                <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${100 - (gapModal.data.gap_percentage || Math.round((gapModal.data.gap_score || 0) * 100))}%` }} />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-emerald-600">{gapModal.data.coverage_percentage || Math.round((1 - (gapModal.data.gap_score || 0)) * 100)}%</div>
                  <div className="text-xs text-surface-500">Coverage</div>
                </div>
              </div>

              {gapModal.data.missing_skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-surface-700 mb-2">Missing Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {gapModal.data.missing_skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {gapModal.data.recommended_courses?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-surface-700 mb-2">Recommended Courses</h4>
                  <div className="space-y-2">
                    {gapModal.data.recommended_courses.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-100">
                        <div>
                          <div className="text-sm font-medium text-surface-900">{c.name}</div>
                          <div className="text-xs text-surface-500">{c.platform} · {c.duration}</div>
                        </div>
                        <a href={c.url} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 transition-colors">
                          Enroll
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-surface-500">Failed to load skill gap data.</p>
          )}
        </Modal>
      )}
    </div>
  )
}
