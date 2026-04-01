import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="EquiPath Home">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold text-white">
                Equi<span className="text-primary-400">Path</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed">
              AI-powered inclusive career ecosystem. Matching abilities to opportunities.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-sm hover:text-primary-400 transition-colors">Create Account</Link></li>
              <li><Link to="/assessment" className="text-sm hover:text-primary-400 transition-colors">Ability Assessment</Link></li>
              <li><Link to="/jobs" className="text-sm hover:text-primary-400 transition-colors">Job Listings</Link></li>
              <li><Link to="/skill-gap" className="text-sm hover:text-primary-400 transition-colors">Skill Gap Navigator</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-sm hover:text-primary-400 transition-colors">Register Company</Link></li>
              <li><Link to="/employer/post-job" className="text-sm hover:text-primary-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/employer/audit" className="text-sm hover:text-primary-400 transition-colors">Readiness Audit</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#accessibility" className="text-sm hover:text-primary-400 transition-colors">Accessibility Statement</a></li>
              <li><a href="#privacy" className="text-sm hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#contact" className="text-sm hover:text-primary-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-700/50 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} EquiPath. Built with ♥ for inclusion.
          </p>
          <p className="text-xs text-surface-500">
            WCAG 2.1 AA Compliant • Keyboard Accessible • Screen Reader Friendly
          </p>
        </div>
      </div>
    </footer>
  )
}
