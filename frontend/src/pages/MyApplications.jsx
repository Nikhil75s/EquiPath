import { useState, useEffect } from 'react'
import api from '../services/api'
import Spinner from '../components/common/Spinner'

const STATUS_COLORS = {
  applied: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-teal-100 text-teal-700',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700'
}

export default function MyApplications() {
  const [loading, setLoading] = useState(true)
  const [apps, setApps] = useState([])

  useEffect(() => {
    api.get('/seeker/applications')
      .then(res => setApps(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-20"><Spinner size="lg" message="Loading applications..." /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">My Applications</h1>
      <p className="text-surface-500 text-sm mb-8">{apps.length} application{apps.length !== 1 ? 's' : ''} submitted</p>

      {apps.length > 0 ? (
        <div className="space-y-4">
          {apps.map(app => (
            <div key={app.id} className="bg-white rounded-xl border border-surface-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-surface-900">{app.job_title || 'Job'}</h3>
                  <p className="text-sm text-surface-500">{app.company_name || 'Anonymous Employer'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    (app.match_score || 0) >= 0.7 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{Math.round((app.match_score || 0) * 100)}%</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[app.status] || ''}`}>
                    {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                  </span>
                  <span className="text-xs text-surface-400">
                    {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
          <p className="text-surface-400 mb-2">No applications yet.</p>
          <p className="text-sm text-surface-400">Browse matched jobs and start applying!</p>
        </div>
      )}
    </div>
  )
}
