export default function SkillGapCard({ gapData }) {
  if (!gapData) return null

  const coverage = Math.round((1 - gapData.gap_score) * 100)

  return (
    <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Skill Gap Analysis</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="text-3xl font-display font-bold text-primary-600">{coverage}%</div>
        <div className="flex-1">
          <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${coverage}%` }} />
          </div>
          <p className="text-xs text-surface-400 mt-1">Skill coverage</p>
        </div>
      </div>

      {gapData.missing_skills?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-surface-700 mb-2">Missing Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {gapData.missing_skills.map((skill, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-medium">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {gapData.recommended_courses?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-surface-700 mb-2">Recommended Courses</h4>
          <div className="space-y-2">
            {gapData.recommended_courses.slice(0, 3).map((course, i) => (
              <a key={i} href={course.url} target="_blank" rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-surface-50 hover:bg-primary-50 transition-colors">
                <p className="text-sm font-medium text-surface-800">{course.course}</p>
                <p className="text-xs text-surface-400">{course.platform} • {course.duration}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
