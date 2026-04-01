import { useState, useEffect } from 'react'
import api from '../services/api'
import Button from '../components/common/Button'

export default function SkillGapNavigator() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [gapData, setGapData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchingJobs, setFetchingJobs] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await api.get('/seeker/jobs')
      if (res.data.success) {
        setJobs(res.data.data.matches || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFetchingJobs(false)
    }
  }

  const analyzeGap = async (jobId) => {
    setLoading(true)
    setSelectedJob(jobId)
    try {
      const res = await api.get(`/seeker/skill-gap/${jobId}`)
      if (res.data.success) {
        setGapData(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">📚 Skill Gap Navigator</h1>
        <p className="text-surface-500">Select a job to see what skills you need and get personalized course recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <section className="lg:col-span-1 bg-white rounded-2xl border border-surface-100 shadow-sm p-6" aria-label="Available Jobs">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Select a Job</h2>
          {fetchingJobs ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-500 border-t-transparent" /></div>
          ) : jobs.length > 0 ? (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {jobs.map((job, i) => (
                <button key={i} onClick={() => analyzeGap(job.job_id)} className={`w-full text-left p-3 rounded-xl border transition-all
                  ${selectedJob === job.job_id ? 'border-primary-500 bg-primary-50' : 'border-surface-100 hover:border-surface-200 hover:bg-surface-50'}`}>
                  <p className="font-medium text-sm text-surface-900">{job.title}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{job.work_mode} • Match: {Math.round(job.match_score * 100)}%</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">Complete your assessment first to see jobs.</p>
          )}
        </section>

        {/* Gap Analysis */}
        <section className="lg:col-span-2 space-y-6" aria-label="Gap Analysis Results">
          {loading ? (
            <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-12 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : gapData ? (
            <>
              {/* Coverage Card */}
              <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4">Skill Coverage</h2>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-primary-500)" strokeWidth="3"
                        strokeDasharray={`${(1 - gapData.gap_score) * 100}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-surface-900">{Math.round((1 - gapData.gap_score) * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-surface-500">You have <strong className="text-surface-900">{gapData.matched_skills?.length || 0}</strong> of the required skills</p>
                    <p className="text-sm text-surface-500 mt-1">Missing <strong className="text-red-600">{gapData.missing_skills?.length || 0}</strong> skills</p>
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              {gapData.missing_skills?.length > 0 && (
                <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-surface-900 mb-4">Missing Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {gapData.missing_skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium border border-red-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Recommendations */}
              {gapData.recommended_courses?.length > 0 && (
                <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-surface-900 mb-4">📖 Recommended Courses</h2>
                  <div className="space-y-3">
                    {gapData.recommended_courses.map((course, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:border-primary-200 transition-colors">
                        <div>
                          <p className="font-medium text-surface-900">{course.course}</p>
                          <p className="text-sm text-surface-500 mt-0.5">{course.platform} • {course.duration} • For: <span className="text-primary-600 font-medium">{course.skill}</span></p>
                        </div>
                        <a href={course.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                          <Button size="sm" variant="outline">Start →</Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-12 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Select a job to analyze</h2>
              <p className="text-surface-500">Choose a job from the list to see your skill gap analysis and personalized course recommendations.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
