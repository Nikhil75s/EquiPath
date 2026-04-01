import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

const STATUS_COLORS = {
  applied: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-teal-100 text-teal-700',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700'
}

const MOOD_EMOJIS = ['😢', '😟', '😐', '🙂', '😊']

export default function JobSeekerDashboard() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [matchedJobs, setMatchedJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')
  const [wellnessLoading, setWellnessLoading] = useState(false)
  const [wellnessSuccess, setWellnessSuccess] = useState(false)

  useEffect(() => {
    Promise.all([
      profile?.assessment_done ? api.get('/seeker/jobs').catch(() => ({ data: { data: { matches: [] } } })) : Promise.resolve({ data: { data: { matches: [] } } }),
      api.get('/seeker/applications').catch(() => ({ data: { data: [] } }))
    ]).then(([jobsRes, appsRes]) => {
      setMatchedJobs((jobsRes.data.data?.matches || []).slice(0, 3))
      setApplications(appsRes.data.data || [])
    }).finally(() => setLoading(false))
  }, [profile?.assessment_done])

  const logWellness = async () => {
    setWellnessLoading(true)
    try {
      await api.post('/seeker/career-path/wellness', { mood, note })
      setWellnessSuccess(true)
      setNote('')
      setTimeout(() => setWellnessSuccess(false), 3000)
    } catch {} finally { setWellnessLoading(false) }
  }

  if (loading) return <div className="py-20"><Spinner size="lg" message="Loading dashboard..." /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Card */}
      <div className="gradient-primary rounded-3xl p-8 text-white mb-8 shadow-glow relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl font-display font-bold mb-1">
              Hello, {profile?.full_name || 'there'} 👋
            </h1>
            <p className="text-primary-100 text-sm font-medium">Welcome to your EquiPath dashboard</p>
          </div>
          {profile?.assessment_done && profile?.ability_score ? (
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="35" fill="none" stroke="white" strokeWidth="6"
                    strokeDasharray={`${(profile.ability_score / 100) * 220} 220`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{Math.round(profile.ability_score)}</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Ability Score</div>
                <div className="text-primary-200 text-xs">out of 100</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Assessment CTA */}
      {!profile?.assessment_done && (
        <div className="bg-amber-50 border border-amber-200 shadow-sm rounded-3xl p-8 mb-8 animate-[fade-in_0.5s_ease-out]">
          <h2 className="text-xl font-semibold text-amber-900 mb-2 tracking-tight">Complete Your Ability Assessment</h2>
          <p className="text-amber-700 text-sm font-medium mb-5">Take a 5-minute assessment to unlock AI-matched jobs and skill gap analysis.</p>
          <Link to="/assessment"><Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-md border-0">Start Assessment →</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <div className="lg:col-span-2 glass rounded-3xl border border-white/60 shadow-card p-6 relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200/50">
            <h2 className="text-xl font-bold text-surface-900 tracking-tight">Top Matches</h2>
            <Link to="/jobs" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">View All →</Link>
          </div>
          {matchedJobs.length > 0 ? (
            <div className="space-y-3">
              {matchedJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <div>
                    <div className="font-medium text-sm text-surface-900">{job.title}</div>
                    <div className="text-xs text-surface-500">{job.company_name} · {job.work_mode}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    (job.match_score || 0) >= 0.7 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{Math.round((job.match_score || 0) * 100)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-400 text-sm py-4">
              {profile?.assessment_done ? 'No matched jobs yet.' : 'Complete your assessment to see matches.'}
            </p>
          )}
        </div>

        {/* Wellness Widget */}
        <div className="glass rounded-3xl border border-white/60 shadow-card p-6 relative">
          <h2 className="text-xl font-bold text-surface-900 mb-6 tracking-tight">How are you today?</h2>
          <div className="flex justify-between mb-6">
            {MOOD_EMOJIS.map((emoji, i) => (
              <button key={i} onClick={() => setMood(i + 1)}
                className={`text-2xl p-2 rounded-2xl transition-all duration-300 ${mood === i + 1 ? 'bg-primary-100 text-black shadow-inner scale-110' : 'hover:bg-surface-100/50 hover:scale-105 opacity-70 hover:opacity-100'}`}>
                {emoji}
              </button>
            ))}
          </div>
          <textarea rows="2" value={note} onChange={e => setNote(e.target.value)}
            placeholder="Any notes about today..."
            className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-white/50 text-sm resize-none mb-4 focus:outline-none focus:ring-3 focus:ring-primary-100 focus:bg-white transition-all shadow-inner" />
          <Button size="sm" className="w-full shadow-md" onClick={logWellness} disabled={wellnessLoading}>
            {wellnessLoading ? '...' : wellnessSuccess ? '✓ Logged!' : 'Log Today'}
          </Button>
        </div>

        {/* Applications */}
        <div className="lg:col-span-3 glass rounded-3xl border border-white/60 shadow-card p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200/50">
            <h2 className="text-xl font-bold text-surface-900 tracking-tight">My Applications</h2>
            <Link to="/seeker/applications" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">View All →</Link>
          </div>
          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-surface-500 border-b border-surface-100">
                  <th className="pb-2 font-medium">Job</th>
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Match</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {applications.slice(0, 5).map(app => (
                    <tr key={app.id} className="border-b border-surface-50">
                      <td className="py-3 font-medium text-surface-900">{app.job_title}</td>
                      <td className="py-3 text-surface-500">{app.company_name}</td>
                      <td className="py-3">{Math.round((app.match_score || 0) * 100)}%</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[app.status] || ''}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-surface-400 text-sm py-4">No applications yet. Browse matched jobs to get started!</p>
          )}
        </div>
      </div>
    </div>
  )
}
