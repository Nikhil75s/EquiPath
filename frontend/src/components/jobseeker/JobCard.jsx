import { formatMatchScore } from '../../utils/formatters'

export default function JobCard({ job, onApply, onViewGap }) {
  return (
    <article className="bg-white rounded-2xl border border-surface-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-surface-900">{job.title}</h3>
          <p className="text-sm text-surface-500">{job.company_name || 'Anonymous Employer'}</p>
        </div>
        {job.match_score !== undefined && (
          <span className={`px-3 py-1 rounded-full text-sm font-bold shrink-0
            ${job.match_score >= 0.7 ? 'bg-emerald-100 text-emerald-700' : job.match_score >= 0.4 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
            {formatMatchScore(job.match_score)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 text-xs font-medium">
          {job.work_mode}
        </span>
        {job.salary_range && (
          <span className="px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 text-xs font-medium">
            {job.salary_range}
          </span>
        )}
        {(job.required_skills || []).slice(0, 3).map((skill, i) => (
          <span key={i} className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-medium">{skill}</span>
        ))}
      </div>

      {job.description && (
        <p className="text-sm text-surface-500 mb-4 line-clamp-2">{job.description}</p>
      )}

      <div className="flex gap-2">
        {onApply && <button onClick={() => onApply(job)} className="px-4 py-2 text-sm font-semibold gradient-primary text-white rounded-xl hover:shadow-md transition-all">Apply</button>}
        {onViewGap && <button onClick={() => onViewGap(job)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-xl transition-all">Skill Gap</button>}
      </div>
    </article>
  )
}
