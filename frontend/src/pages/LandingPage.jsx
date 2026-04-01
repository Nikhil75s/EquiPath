import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/common/Button'

const FEATURES = [
  {
    icon: '🎯',
    title: 'Ability-Based Matching',
    description: 'Our AI matches your functional abilities to job requirements — not medical labels to listings.',
    color: 'from-primary-500 to-primary-600'
  },
  {
    icon: '📚',
    title: 'Skill Gap Navigator',
    description: 'Discover exactly what skills you need and get personalized course recommendations.',
    color: 'from-accent-400 to-accent-500'
  },
  {
    icon: '🔒',
    title: 'Anonymous Hiring',
    description: 'Your disability status stays private until shortlisted. Employers see only your skills.',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    icon: '📊',
    title: 'Employer Readiness',
    description: 'Companies get scored on their inclusion practices with actionable recommendations.',
    color: 'from-violet-500 to-violet-600'
  },
]

export default function LandingPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      if (res.data.success) setStats(res.data.data)
    }).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Enhanced decorative blobs */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <div className="text-left animate-[slide-up_0.8s_ease-out]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-semibold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" aria-hidden="true" />
                Waitlist Open: Next-Gen Inclusion
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-surface-900 leading-[1.1] mb-6 tracking-tight">
                Match by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">Abilities</span>.<br />
                Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-emerald-400">Career</span>.
              </h1>
              <p className="text-lg sm:text-xl text-surface-600 mb-10 leading-relaxed font-medium max-w-lg">
                EquiPath connects persons with disabilities to meaningful careers through AI-powered ability matching, anonymous hiring, and personalized skill development.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link to="/register">
                  <Button size="xl" variant="primary">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="xl" variant="secondary">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Premium Glass Card Graphic */}
            <div className="hidden lg:block relative animate-[fade-in_1.2s_ease-out]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-accent-100 rounded-3xl transform rotate-3 scale-105 opacity-50 blur-xl"></div>
              <div className="relative glass shadow-card-hover rounded-3xl p-8 border border-white/60">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-200/50">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl">👋</div>
                  <div>
                    <h3 className="text-xl font-bold text-surface-900">Priya Sharma</h3>
                    <p className="text-surface-500 font-medium text-sm">Frontend Engineer • 82% Ability Match</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/60 rounded-xl">
                    <span className="text-surface-600 font-medium">Seated Work Friendly</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg text-sm">Matched</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/60 rounded-xl">
                    <span className="text-surface-600 font-medium">Remote Tools Required</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg text-sm">Matched</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full text-white">
            <path d="M0 120V60C240 100 480 20 720 60C960 100 1200 20 1440 60V120H0Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-28 bg-white" aria-label="Features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 mb-4 tracking-tight">
              An Ecosystem, Not Just a Job Board
            </h2>
            <p className="text-lg text-surface-600 font-medium">
              From assessment to employment and beyond — EquiPath supports every step of your career journey natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <article
                key={i}
                className="group relative p-6 rounded-2xl bg-white border border-surface-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="py-16 gradient-primary" aria-label="Platform statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: stats ? stats.total_users : '—', label: 'Registered Users' },
              { value: stats ? stats.active_jobs : '—', label: 'Active Jobs' },
              { value: stats ? stats.total_applications : '—', label: 'Applications' },
              { value: stats?.avg_match_score ? `${Math.round(stats.avg_match_score * 100)}%` : '—', label: 'Avg Match Score' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-surface-50 border-t border-surface-100" aria-label="How it works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 mb-4 tracking-tight">
              How EquiPath Works
            </h2>
            <p className="text-lg text-surface-600 font-medium">A seamless, dignified workflow from day one.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Complete Your Assessment', desc: 'Take a 5-minute functional ability assessment. We measure what you CAN do, not what you can\'t.' },
              { step: '02', title: 'Get AI-Matched Jobs', desc: 'Our AI matches your abilities and skills to job requirements. Apply anonymously — your disability stays private.' },
              { step: '03', title: 'Build Your Career', desc: 'Track your career path, close skill gaps with recommended courses, and monitor your wellness.' },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-white border border-surface-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-5xl font-display font-extrabold text-primary-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">{item.title}</h3>
                <p className="text-surface-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white border-t border-surface-100" aria-label="Call to action">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-extrabold text-surface-900 mb-6 tracking-tight">
            Ready to Find Your Path?
          </h2>
          <p className="text-lg text-surface-600 mb-10 max-w-2xl mx-auto font-medium">
            Join professionals who have discovered careers that value their abilities. Your journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="xl" className="shadow-glow">Create Free Account</Button>
            </Link>
            <Link to="/register">
              <Button size="xl" variant="outline" className="bg-white">Register as Employer</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
