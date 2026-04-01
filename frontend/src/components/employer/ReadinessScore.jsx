import { formatGrade } from '../../utils/formatters'

export default function ReadinessScore({ score = 0, grade = 'F' }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
            strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-surface-900">{score}</span>
        </div>
      </div>
      <div>
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-bold ${formatGrade(grade)}`}>
          Grade {grade}
        </span>
        <p className="text-xs text-surface-500 mt-1">
          {score >= 80 ? 'Excellent inclusion readiness' : score >= 50 ? 'Good progress' : 'Needs improvement'}
        </p>
      </div>
    </div>
  )
}
