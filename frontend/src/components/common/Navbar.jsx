import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (user.role === 'jobseeker') return '/dashboard/seeker'
    if (user.role === 'employer') return '/dashboard/employer'
    if (user.role === 'admin') return '/admin'
    return '/'
  }

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm border-b border-white/60 transition-all duration-300" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="EquiPath Home">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-surface-900 tracking-tight">
              Equi<span className="text-primary-500">Path</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {!user && (
              <>
                <Link to="/#features" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  Features
                </Link>
                <Link to="/jobs" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  For Job Seekers
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  For Employers
                </Link>
              </>
            )}
            {user?.role === 'jobseeker' && (
              <>
                <Link to="/dashboard/seeker" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  Dashboard
                </Link>
                <Link to="/jobs" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  Jobs
                </Link>
                <Link to="/assessment" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  Assessment
                </Link>
              </>
            )}
            {user?.role === 'employer' && (
              <>
                <Link to="/dashboard/employer" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  Dashboard
                </Link>
                <Link to="/employer/post-job" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  Post Job
                </Link>
                <Link to="/employer/audit" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                  Readiness Audit
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardLink()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 text-sm font-medium text-surface-700">
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-surface-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-surface-700 hover:text-primary-600 rounded-lg hover:bg-surface-100 transition-all">
                  Log In
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white gradient-primary rounded-xl shadow-glow hover:scale-[1.03] transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-200/50 bg-white/95 backdrop-blur-xl animate-[slide-up_0.2s_ease-out]">
          <div className="px-4 py-3 space-y-1">
            {!user && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-surface-700 rounded-lg hover:bg-surface-100">Log In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-white gradient-primary rounded-xl text-center">Get Started</Link>
              </>
            )}
            {user?.role === 'jobseeker' && (
              <>
                <Link to="/dashboard/seeker" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-surface-100">Dashboard</Link>
                <Link to="/jobs" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-surface-100">Jobs</Link>
                <Link to="/assessment" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-surface-100">Assessment</Link>
              </>
            )}
            {user?.role === 'employer' && (
              <>
                <Link to="/dashboard/employer" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-surface-100">Dashboard</Link>
                <Link to="/employer/post-job" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-surface-100">Post Job</Link>
                <Link to="/employer/audit" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-surface-100">Readiness Audit</Link>
              </>
            )}
            {user && (
              <button onClick={handleLogout} className="w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 text-left">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
