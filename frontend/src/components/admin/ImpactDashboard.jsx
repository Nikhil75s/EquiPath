export default function ImpactDashboard({ stats }) {
  if (!stats) return null

  const cards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥' },
    { label: 'Active Jobs', value: stats.activeJobs || 0, icon: '💼' },
    { label: 'This Month', value: stats.applicationsThisMonth || 0, icon: '📬' },
    { label: 'Avg Match', value: `${Math.round((stats.avgMatchScore || 0) * 100)}%`, icon: '🎯' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-2xl border border-surface-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
          <div className="text-2xl mb-2">{card.icon}</div>
          <div className="text-2xl font-display font-bold text-surface-900">{card.value}</div>
          <div className="text-xs font-medium text-surface-500">{card.label}</div>
        </div>
      ))}
    </div>
  )
}
