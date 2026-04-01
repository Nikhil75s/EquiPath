import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

const STATUS_OPTIONS = ['applied', 'shortlisted', 'interview', 'offer', 'rejected']
const STATUS_COLORS = {
  applied: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-teal-100 text-teal-700',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700'
}

export default function Applicants() {
  const { jobId } = useParams()
  const [loading, setLoading] = useState(true)
  const [applicants, setApplicants] = useState([])
  const [job, setJob] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchApplicants()
  }, [jobId])

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/employer/jobs/${jobId}/applicants`)
      setApplicants(res.data.data?.applicants || [])
      setJob(res.data.data?.job || null)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const updateStatus = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      await api.put(`/employer/jobs/${jobId}/applicants/${appId}/status`, { status: newStatus })
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update')
    } finally { setUpdating(null) }
  }

  if (loading) return <div className="py-20"><Spinner size="lg" message="Loading applicants..." /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-1">
          Applicants for: {job?.title || 'Job'}
        </h1>
        <p className="text-surface-500 text-sm">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</p>
        {job?.is_anonymous_hiring && (
          <div className="mt-2 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-lg text-xs text-primary-700 inline-block">
            🔒 Anonymous Hiring — Candidate identities hidden until shortlisted
          </div>
        )}
      </div>

      {applicants.length > 0 ? (
        <div className="space-y-4">
          {applicants.map((app, idx) => (
            <div key={app.id} className="bg-white rounded-xl border border-surface-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-sm font-bold text-surface-600">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">
                        {app.disability_revealed ? (app.full_name || app.display_name || `Candidate #${app.seeker_id}`) : (app.display_name || `Candidate #${app.seeker_id}`)}
                      </h3>
                      {app.disability_revealed && app.disability_type && (
                        <span className="text-xs text-surface-500">Disability: {app.disability_type}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 ml-13">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      (app.match_score || 0) >= 0.7 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{Math.round((app.match_score || 0) * 100)}% Match</span>
                    {(app.skills || []).slice(0, 4).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-surface-100 text-surface-600 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)}
                    disabled={updating === app.id}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium ${STATUS_COLORS[app.status] || ''} border-surface-200`}>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  {updating === app.id && <Spinner size="sm" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
          <p className="text-surface-400">No applicants yet for this job.</p>
        </div>
      )}
    </div>
  )
}
