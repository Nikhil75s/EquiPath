import { formatDate } from '../../utils/formatters'

export default function UserTable({ users = [], onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" role="table">
        <thead>
          <tr className="border-b border-surface-100">
            <th className="text-left py-3 px-4 font-medium text-surface-500">ID</th>
            <th className="text-left py-3 px-4 font-medium text-surface-500">Email</th>
            <th className="text-left py-3 px-4 font-medium text-surface-500">Role</th>
            <th className="text-left py-3 px-4 font-medium text-surface-500">Joined</th>
            <th className="text-right py-3 px-4 font-medium text-surface-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
              <td className="py-3 px-4 text-surface-600">#{user.id}</td>
              <td className="py-3 px-4 text-surface-900 font-medium">{user.email}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${user.role === 'admin' ? 'bg-violet-100 text-violet-700' : user.role === 'employer' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4 text-surface-500">{formatDate(user.created_at)}</td>
              <td className="py-3 px-4 text-right">
                {user.role !== 'admin' && onDelete && (
                  <button onClick={() => onDelete(user.id)} className="text-xs text-red-500 hover:text-red-700 font-medium"
                    aria-label={`Deactivate ${user.email}`}>
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
