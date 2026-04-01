import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    setError('')
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'employer') navigate('/dashboard/employer')
      else navigate('/dashboard/seeker')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-[slide-up_0.5s_ease-out]">
        <div className="text-left mb-8">
          <h1 className="text-4xl font-display font-bold text-surface-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-lg text-surface-600 font-medium">Sign in to your EquiPath account</p>
        </div>

        <div className="glass rounded-3xl border border-white/60 shadow-glow p-8 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600" role="alert">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1">Email</label>
              <input id="email" type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400"
                placeholder="you@email.com" autoComplete="email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1">Password</label>
              <input id="password" type="password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-400"
                placeholder="Enter your password" autoComplete="current-password" />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Sign In'}
            </Button>
          </form>

          <p className="text-left text-sm text-surface-500 mt-8 relative z-10">
            Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">Register</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-surface-100">
            <p className="text-xs text-surface-400 text-center mb-3">Test Accounts</p>
            <div className="space-y-1.5 text-xs text-surface-500">
              <div className="flex justify-between"><span>Admin:</span><span className="font-mono">admin@equipath.com / admin123</span></div>
              <div className="flex justify-between"><span>Employer:</span><span className="font-mono">hr@techcorp.com / test123</span></div>
              <div className="flex justify-between"><span>Seeker:</span><span className="font-mono">arjun@email.com / test123</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
