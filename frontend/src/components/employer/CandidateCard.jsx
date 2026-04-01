export default function CandidateCard({ candidate, onUpdateStatus }) {
  const isRevealed = candidate.disability_revealed

  return (
    <div className="bg-white rounded-xl border border-surface-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-surface-900">{candidate.display_name}</h3>
          <p className="text-sm text-surface-500">
            {candidate.experience_years} yrs exp • {candidate.education_level?.replace(/_/g, ' ')} • {candidate.preferred_work_mode}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold
          ${candidate.match_score >= 0.7 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {Math.round((candidate.match_score || 0) * 100)}%
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(candidate.skills || []).slice(0, 5).map((skill, i) => (
          <span key={i} className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-medium">{skill}</span>
        ))}
      </div>

      {/* Ability Score */}
      {candidate.ability_score && (
        <p className="text-xs text-surface-500 mb-3">Ability Score: <strong>{candidate.ability_score}</strong></p>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-50">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${candidate.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-700' : candidate.status === 'interview' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {candidate.status}
        </span>

        {onUpdateStatus && candidate.status === 'applied' && (
          <button onClick={() => onUpdateStatus(candidate.id, 'shortlisted')}
            className="text-xs font-medium text-primary-600 hover:text-primary-700">
            Shortlist →
          </button>
        )}
      </div>

      {!isRevealed && (
        <p className="mt-2 text-[10px] text-surface-400 italic">
          🔒 Identity hidden — shortlist to reveal full profile
        </p>
      )}
    </div>
  )
}
