import { useState, useRef } from 'react'
import { useAnnouncer } from './AriaLiveRegion'

const COMMON_SKILLS = [
  'Python', 'SQL', 'Excel', 'Communication', 'Leadership', 'Java',
  'React', 'Machine Learning', 'PowerBI', 'Tableau', 'JavaScript',
  'CSS', 'Data Analysis', 'Node.js', 'Docker', 'AWS', 'TensorFlow'
]

export default function SkillTagInput({ skills = [], onChange, placeholder = 'Type a skill and press Enter...', suggestions = COMMON_SKILLS }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const announce = useAnnouncer()

  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...skills, trimmed])
      announce(`Added skill: ${trimmed}`)
    }
    setInput('')
  }

  const removeSkill = (index) => {
    const removedItem = skills[index]
    onChange(skills.filter((_, i) => i !== index))
    if (removedItem) {
      announce(`Removed skill: ${removedItem}`)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addSkill(input)
    }
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      removeSkill(skills.length - 1)
    }
  }

  const filteredSuggestions = suggestions.filter(
    s => !skills.some(sk => sk.toLowerCase() === s.toLowerCase())
  )

  return (
    <div className="space-y-3">
      {/* Tags + Input */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-xl border border-surface-200 bg-white min-h-[48px] cursor-text focus-within:ring-3 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all"
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium border border-primary-200"
          >
            {skill}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeSkill(i); }}
              className="ml-0.5 text-primary-400 hover:text-red-500 transition-colors font-bold text-xs"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent py-1"
          aria-label="Add skill"
        />
      </div>

      {/* Suggestion Chips */}
      {filteredSuggestions.length > 0 && (
        <div>
          <p className="text-xs text-surface-400 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.slice(0, 12).map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-100 text-surface-600 hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <p className="text-xs text-surface-400">{skills.length} skill{skills.length !== 1 ? 's' : ''} added</p>
      )}
    </div>
  )
}
