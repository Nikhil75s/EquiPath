import { useState, useEffect } from 'react'
import api from '../services/api'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'

const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-700',
  employer: 'bg-blue-100 text-blue-700',
  jobseeker: 'bg-teal-100 text-teal-700'
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [deactivating, setDeactivating] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users')
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data.data)
      setUsers(usersRes.data.data || [])
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const deactivateUser = async (userId) => {
    if (!confirm('Deactivate this user?')) return
    setDeactivating(userId)
    try {
      await api.put(`/admin/users/${userId}/deactivate`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) { alert(err.response?.data?.error || 'Failed') }
    finally { setDeactivating(null) }
  }

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (search && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) return <div className="py-20"><Spinner size="lg" message="Loading admin dashboard..." /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-surface-900 mb-8">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats?.total_users || 0, color: 'from-primary-500 to-primary-600' },
          { label: 'Job Seekers', value: stats?.seekers || 0, color: 'from-teal-500 to-teal-600' },
          { label: 'Employers', value: stats?.employers || 0, color: 'from-blue-500 to-blue-600' },
          { label: 'Active Jobs', value: stats?.active_jobs || 0, color: 'from-violet-500 to-violet-600' },
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white`}>
            <div className="text-3xl font-display font-extrabold">{stat.value}</div>
            <div className="text-xs font-medium opacity-80 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Applications Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-surface-100 p-5 text-center">
          <div className="text-2xl font-display font-bold text-surface-900">{stats?.total_applications || 0}</div>
          <div className="text-xs text-surface-500 mt-1">Total Applications</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-100 p-5 text-center">
          <div className="text-2xl font-display font-bold text-surface-900">{stats?.applications_this_month || 0}</div>
          <div className="text-xs text-surface-500 mt-1">This Month</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-100 p-5 text-center">
          <div className="text-2xl font-display font-bold text-surface-900">{Math.round((stats?.avg_match_score || 0) * 100)}%</div>
          <div className="text-xs text-surface-500 mt-1">Avg Match Score</div>
        </div>
      </div>

      {/* Monthly Trend */}
      {stats?.monthly_trend?.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Monthly Application Trend</h2>
          <div className="flex items-end gap-2 h-40">
            {stats.monthly_trend.map((m, i) => {
              const max = Math.max(...stats.monthly_trend.map(t => t.count || 0), 1)
              const height = ((m.count || 0) / max) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-surface-700">{m.count || 0}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 transition-all"
                    style={{ height: `${Math.max(height, 4)}%` }} />
                  <span className="text-xs text-surface-400">{m.month || ''}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-surface-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg font-semibold text-surface-900">Users</h2>
          <div className="flex gap-2">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email..."
              className="px-3 py-2 rounded-lg border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 w-48" />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-surface-200 text-sm">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employer">Employer</option>
              <option value="jobseeker">Job Seeker</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-surface-500 border-b border-surface-100">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="py-3 text-surface-400">{user.id}</td>
                  <td className="py-3 font-medium text-surface-900">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[user.role] || ''}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-surface-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    {user.role !== 'admin' && (
                      <button onClick={() => deactivateUser(user.id)} disabled={deactivating === user.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50">
                        {deactivating === user.id ? '...' : 'Deactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-surface-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
