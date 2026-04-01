import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

export default function EmployerDashboard() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [employer, setEmployer] = useState(null)
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/employer/profile'),
      api.get('/employer/jobs')
    ]).then(([profRes, jobsRes]) => {
      setEmployer(profRes.data.data)
      setJobs(jobsRes.data.data || [])
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-20"><Spinner size="lg" message="Loading dashboard..." /></div>

  const score = employer?.accessibility_score || 0
  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
  const gradeColor = { A: 'text-emerald-600 bg-emerald-100', B: 'text-blue-600 bg-blue-100', C: 'text-amber-600 bg-amber-100', D: 'text-red-600 bg-red-100' }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="gradient-primary rounded-3xl p-8 text-white mb-8 shadow-glow relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold mb-1 tracking-tight">{employer?.company_name || 'Your Company'}</h1>
          <p className="text-primary-100 text-sm font-medium">{employer?.industry || 'Inclusive Employer'} · {employer?.company_size || '—'}</p>
        </div>
      </div>

      {/* Audit CTA / Score */}
      {!employer?.audit_done ? (
        <div className="bg-amber-50 border border-amber-200 shadow-sm rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-2 tracking-tight">Complete Your Readiness Audit</h2>
          <p className="text-amber-700 text-sm font-medium mb-5">Get your Accessibility Readiness Score and actionable recommendations.</p>
          <Link to="/employer/audit"><Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-md border-0">Start Audit →</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass shadow-card rounded-3xl border border-white/60 p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle cx="40" cy="40" r="35" fill="none" stroke="var(--color-primary-500)" strokeWidth="6"
                  strokeDasharray={`${(score / 100) * 220} 220`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-surface-900">{score}</span>
              </div>
            </div>
            <div className="text-sm font-bold text-surface-700">Readiness Score</div>
          </div>
          <div className="glass shadow-card rounded-3xl border border-white/60 p-6 text-center flex flex-col items-center justify-center">
            <span className={`text-5xl font-display font-extrabold px-6 py-2 rounded-2xl shadow-sm ${gradeColor[grade] || ''}`}>{grade}</span>
            <div className="text-sm font-bold text-surface-700 mt-4">Grade</div>
          </div>
          <div className="glass shadow-card rounded-3xl border border-white/60 p-6 text-center flex flex-col items-center justify-center">
            <div className="text-5xl font-display font-extrabold text-surface-900">{jobs.filter(j => j.is_active).length}</div>
            <div className="text-sm font-bold text-surface-700 mt-2">Active Jobs</div>
            <Link to="/employer/audit" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors mt-3">Retake Audit →</Link>
          </div>
        </div>
      )}

      {/* My Jobs */}
      <div className="glass shadow-card rounded-3xl border border-white/60 p-6 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200/50">
          <h2 className="text-xl font-bold text-surface-900 tracking-tight">My Job Postings</h2>
          <Link to="/employer/post-job"><Button size="sm" className="shadow-glow">+ Post New Job</Button></Link>
        </div>
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-surface-500 border-b border-surface-100">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Mode</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                    <td className="py-3 font-medium text-surface-900">{job.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        job.work_mode === 'remote' ? 'bg-emerald-100 text-emerald-700' :
                        job.work_mode === 'hybrid' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>{job.work_mode}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        job.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-100 text-surface-500'
                      }`}>{job.is_active ? 'Active' : 'Closed'}</span>
                    </td>
                    <td className="py-3">
                      <Link to={`/employer/jobs/${job.id}/applicants`}
                        className="text-primary-600 hover:underline text-sm font-medium">
                        View Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-surface-400 text-sm py-4">No jobs posted yet. Post your first inclusive job!</p>
        )}
      </div>
    </div>
  )
}
