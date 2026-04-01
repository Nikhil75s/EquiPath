import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    role: '', companyName: ''
  })

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.role) e.role = 'Please select a role'
    if (form.role === 'employer' && !form.companyName.trim()) e.companyName = 'Company name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError('')
    try {
      const user = await register({
        email: form.email,
        password: form.password,
        role: form.role,
        fullName: form.fullName,
        companyName: form.companyName
      })
      navigate(user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-[slide-up_0.5s_ease-out]">
        <div className="text-left mb-8">
          <h1 className="text-4xl font-display font-bold text-surface-900 mb-2 tracking-tight">Create Your Account</h1>
          <p className="text-lg text-surface-600 font-medium">Join EquiPath and start your inclusive career journey</p>
        </div>

        <div className="glass rounded-3xl border border-white/60 shadow-glow p-8 relative overflow-hidden">
          {/* Subtle background flair */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-surface-700 mb-3">I am...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => update('role', 'jobseeker')}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  form.role === 'jobseeker'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                    : 'border-surface-200 text-surface-600 hover:border-surface-300'
                }`}
              >
                <div className="text-2xl mb-1">🔍</div>
                <div className="font-semibold text-sm">Looking for Work</div>
                <div className="text-xs mt-1 opacity-70">Job Seeker</div>
              </button>
              <button
                type="button"
                onClick={() => update('role', 'employer')}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  form.role === 'employer'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                    : 'border-surface-200 text-surface-600 hover:border-surface-300'
                }`}
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-semibold text-sm">Hiring Talent</div>
                <div className="text-xs mt-1 opacity-70">Employer</div>
              </button>
            </div>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600" role="alert">{error}</div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
              <input id="fullName" type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400 ${errors.fullName ? 'border-red-300' : 'border-surface-200'}`}
                placeholder="John Doe" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {form.role === 'employer' && (
              <div className="animate-[fade-in_0.3s_ease-out]">
                <label htmlFor="companyName" className="block text-sm font-medium text-surface-700 mb-1">Company Name</label>
                <input id="companyName" type="text" value={form.companyName} onChange={e => update('companyName', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400 ${errors.companyName ? 'border-red-300' : 'border-surface-200'}`}
                  placeholder="Acme Corp" />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1">Email</label>
              <input id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400 ${errors.email ? 'border-red-300' : 'border-surface-200'}`}
                placeholder="you@email.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1">Password</label>
              <input id="password" type="password" value={form.password} onChange={e => update('password', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400 ${errors.password ? 'border-red-300' : 'border-surface-200'}`}
                placeholder="Min 6 characters" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 mb-1">Confirm Password</label>
              <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400 ${errors.confirmPassword ? 'border-red-300' : 'border-surface-200'}`}
                placeholder="Re-enter password" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </Button>
          </form>

          <p className="text-left text-sm text-surface-500 mt-8">
            Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
