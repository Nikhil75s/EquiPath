import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import SkillTagInput from '../components/common/SkillTagInput'
import SpeechInput from '../components/common/SpeechInput'
import { useAnnouncer } from '../components/common/AriaLiveRegion'

const STEPS = ['Basic Info', 'Functional Abilities', 'Work Preferences', 'Skills', 'Disability Info']

export default function AbilityAssessment() {
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const announce = useAnnouncer()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [form, setForm] = useState({
    full_name: '', education_level: '', experience_years: 2,
    typing_wpm: 50, stress_tolerance: 'medium', communication: 'written',
    mobility: 'seated', auditory_processing: 'normal',
    work_preference: 'remote', preferred_hours: 'full-time',
    skills: [],
    disability_type: '', disability_notes: ''
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const validateStep = () => {
    if (step === 0) {
      if (!form.education_level) { setError('Please select your education level'); return false }
    }
    if (step === 3) {
      if (form.skills.length < 1) { setError('Please add at least 1 skill'); return false }
    }
    setError('')
    return true
  }

  const nextStep = () => {
    if (!validateStep()) return
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      announce(`Now on Step ${step + 2}: ${STEPS[step + 1]}`)
    }
  }

  const prevStep = () => { 
    if (step > 0) {
      setStep(step - 1)
      announce(`Moved back to Step ${step}: ${STEPS[step - 1]}`)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/seeker/assessment', {
        responses: {
          full_name: form.full_name,
          education_level: form.education_level,
          experience_years: form.experience_years,
          typing_wpm: form.typing_wpm,
          stress_tolerance: form.stress_tolerance,
          communication: form.communication,
          mobility: form.mobility,
          auditory_processing: form.auditory_processing,
          work_preference: form.work_preference,
          skills: form.skills,
          disability_type: form.disability_type,
          disability_notes: form.disability_notes,
          abilities: {
            typing_wpm: form.typing_wpm,
            stress_tolerance: form.stress_tolerance,
            communication: form.communication,
            mobility: form.mobility,
            auditory_processing: form.auditory_processing
          }
        }
      })
      setResult(res.data.data)
      await fetchUser()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit assessment')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="xl" message="Computing your ability profile..." />
      </div>
    )
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 animate-[scale-in_0.5s_ease-out]">
        <div className="glass rounded-3xl border border-white/60 shadow-glow p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />
          <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shrink-0">
              <div className="text-center">
                <div className="text-3xl font-display font-extrabold text-white leading-none">{result.ability_score || result.scores?.ability_score}</div>
                <div className="text-[10px] text-primary-100 font-bold uppercase tracking-wider mt-1">Score</div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-surface-900 mb-1 tracking-tight">Your Profile is Ready</h2>
              <p className="text-surface-600 font-medium text-sm">We've mapped your functional abilities perfectly.</p>
            </div>
          </div>
          <Button onClick={() => navigate('/jobs')} size="xl" className="w-full shadow-glow mt-4">
            View Matched Jobs →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-surface-900 mb-2 tracking-tight">Functional Ability Assessment</h1>
        <p className="text-lg text-surface-600 font-medium">This assessment measures what you CAN do. It takes about 5 minutes.</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-surface-700">Step {step + 1} of {STEPS.length}</span>
          <span className="text-sm text-surface-500">{STEPS[step]}</span>
        </div>
        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i <= step ? 'gradient-primary text-white shadow-md' : 'bg-surface-100 text-surface-400'}`}>
              {i < step ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>

      {error && <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600" role="alert">{error}</div>}

      <div className="glass shadow-card rounded-3xl p-6 sm:p-8 border border-white/60">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-5 animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Basic Information</h2>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
              <input id="full_name" type="text" value={form.full_name} onChange={e => update('full_name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400"
                placeholder="Enter your full name" />
            </div>
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-surface-700 mb-1">Education Level</label>
              <select id="education" value={form.education_level} onChange={e => update('education_level', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400">
                <option value="">Select...</option>
                <option value="high_school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-surface-700 mb-1">
                Years of Experience: <span className="text-primary-600 font-bold">{form.experience_years}</span>
              </label>
              <input id="experience" type="range" min="0" max="20" value={form.experience_years}
                onChange={e => update('experience_years', parseInt(e.target.value))}
                className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
              <div className="flex justify-between text-xs text-surface-400 mt-1"><span>0</span><span>20</span></div>
            </div>
          </div>
        )}

        {/* Step 2: Functional Abilities */}
        {step === 1 && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Functional Abilities</h2>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Typing Speed: <span className="text-primary-600 font-bold">{form.typing_wpm} WPM</span>
              </label>
              <input type="range" min="10" max="120" value={form.typing_wpm}
                onChange={e => update('typing_wpm', parseInt(e.target.value))}
                className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
              <div className="flex justify-between text-xs text-surface-400 mt-1"><span>10</span><span>120</span></div>
            </div>

            {[
              { field: 'stress_tolerance', label: 'Stress Tolerance', options: [
                { value: 'low', label: 'Low', emoji: '😌' },
                { value: 'medium', label: 'Medium', emoji: '😐' },
                { value: 'high', label: 'High', emoji: '💪' }
              ]},
              { field: 'communication', label: 'Communication Style', options: [
                { value: 'written', label: 'Written', emoji: '✍️' },
                { value: 'verbal', label: 'Verbal', emoji: '🗣️' },
                { value: 'both', label: 'Both', emoji: '💬' }
              ]},
              { field: 'mobility', label: 'Mobility Type', options: [
                { value: 'full', label: 'Fully Mobile', emoji: '🚶' },
                { value: 'seated', label: 'Seated Preferred', emoji: '🪑' },
                { value: 'limited', label: 'Limited', emoji: '♿' }
              ]},
              { field: 'auditory_processing', label: 'Auditory Processing', options: [
                { value: 'normal', label: 'Normal', emoji: '👂' },
                { value: 'partial', label: 'Partial', emoji: '🔇' },
                { value: 'assisted', label: 'Assisted', emoji: '🦻' }
              ]},
            ].map(({ field, label, options }) => (
              <fieldset key={field}>
                <legend className="block text-sm font-medium text-surface-700 mb-2">{label}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {options.map(opt => (
                    <label key={opt.value} className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                      ${form[field] === opt.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}>
                      <input type="radio" name={field} value={opt.value} checked={form[field] === opt.value}
                        onChange={() => update(field, opt.value)} className="sr-only" />
                      <span className="text-lg mb-0.5">{opt.emoji}</span>
                      <span className="text-xs font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        )}

        {/* Step 3: Work Preferences */}
        {step === 2 && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Work Preferences</h2>
            <fieldset>
              <legend className="block text-sm font-medium text-surface-700 mb-3">Preferred Work Mode</legend>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'remote', label: 'Remote', emoji: '🏠' },
                  { value: 'hybrid', label: 'Hybrid', emoji: '🔄' },
                  { value: 'onsite', label: 'On-site', emoji: '🏢' }
                ].map(mode => (
                  <label key={mode.value} className={`flex flex-col items-center p-5 rounded-xl border-2 cursor-pointer transition-all
                    ${form.work_preference === mode.value ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}>
                    <input type="radio" name="work_pref" value={mode.value} checked={form.work_preference === mode.value}
                      onChange={() => update('work_preference', mode.value)} className="sr-only" />
                    <span className="text-2xl mb-1">{mode.emoji}</span>
                    <span className="font-semibold text-sm">{mode.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="block text-sm font-medium text-surface-700 mb-3">Preferred Working Hours</legend>
              <div className="grid grid-cols-3 gap-3">
                {['Full-time', 'Part-time', 'Flexible'].map(hrs => (
                  <label key={hrs} className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium
                    ${form.preferred_hours === hrs.toLowerCase().replace('-', '') ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}>
                    <input type="radio" name="hours" value={hrs} checked={form.preferred_hours === hrs.toLowerCase().replace('-', '')}
                      onChange={() => update('preferred_hours', hrs.toLowerCase().replace('-', ''))} className="sr-only" />
                    {hrs}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {/* Step 4: Skills */}
        {step === 3 && (
          <div className="space-y-5 animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-lg font-semibold text-surface-900 mb-2">Your Skills</h2>
            <p className="text-sm text-surface-500 mb-4">Type a skill and press Enter, or click suggestions below.</p>
            <SkillTagInput skills={form.skills} onChange={(skills) => update('skills', skills)} />
          </div>
        )}

        {/* Step 5: Disability Info */}
        {step === 4 && (
          <div className="space-y-5 animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-lg font-semibold text-surface-900 mb-2">Disability Information</h2>
            <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-sm text-primary-700">
              <strong>🔒 Privacy Notice:</strong> This information is encrypted and <strong>NEVER shared with employers</strong> at any stage. It is used only to improve our matching algorithms.
            </div>
            <div>
              <label htmlFor="disability_type" className="block text-sm font-medium text-surface-700 mb-1">Disability Type</label>
              <select id="disability_type" value={form.disability_type} onChange={e => update('disability_type', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400">
                <option value="">Prefer not to say</option>
                <option value="Visual">Visual</option>
                <option value="Hearing">Hearing</option>
                <option value="Mobility">Mobility</option>
                <option value="Cognitive">Cognitive</option>
                <option value="Chronic Illness">Chronic Illness</option>
                <option value="Multiple">Multiple</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="disability_notes" className="block text-sm font-medium text-surface-700">Additional Accommodations Needed (Optional)</label>
                <SpeechInput onTranscript={(text) => update('disability_notes', form.disability_notes ? `${form.disability_notes} ${text}` : text)} />
              </div>
              <textarea id="disability_notes" rows="3" value={form.disability_notes} onChange={e => update('disability_notes', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400 resize-none"
                placeholder="e.g., Screen reader compatible tools, flexible scheduling..." />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
          <Button variant="ghost" onClick={prevStep} disabled={step === 0}>← Previous</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={nextStep}>Next Step →</Button>
          ) : (
            <Button onClick={handleSubmit} variant="primary" size="lg">Submit Assessment ✓</Button>
          )}
        </div>
      </div>
    </div>
  )
}
