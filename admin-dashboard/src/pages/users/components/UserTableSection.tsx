import React from 'react'
import {
  User as UserIcon, Key, Lock, Edit2, Trash2
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import type { User } from '../types'

interface UserTableSectionProps {
  users: User[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  getAvatarUrl: (avatar?: string | null) => string | null
  setViewUser: (user: User) => void
  openEditModal: (user: User) => void
  openPermissionModal: (user: User) => void
  openResetPasswordModal: (user: User) => void
  setDeleteTarget: (user: User) => void
  toggleActiveMutation: any
}

export const UserTableSection: React.FC<UserTableSectionProps> = ({
  users,
  isLoading,
  isFetching,
  visibleColumns,
  getAvatarUrl,
  setViewUser,
  openEditModal,
  openPermissionModal,
  openResetPasswordModal,
  setDeleteTarget,
  toggleActiveMutation,
}) => {
  const { t } = useTranslation()

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.avatar && <th className="w-12 text-center">Avatar</th>}
                {visibleColumns.userInfo && <th>User Info & Contact</th>}
                {visibleColumns.phone && <th>Phone</th>}
                {visibleColumns.role && <th>Role & Permissions</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={6} />
              ) : users.length === 0 ? (
                <EmptyState cols={6} message="No user accounts found matching query parameters." />
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.avatar && (
                      <td className="text-center">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center mx-auto">
                          {u.avatar ? (
                            <img src={getAvatarUrl(u.avatar) || ''} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={18} className="text-muted-foreground" />
                          )}
                        </div>
                      </td>
                    )}
                    {visibleColumns.userInfo && (
                      <td>
                        <div className="space-y-0.5">
                          <p
                            onClick={() => setViewUser(u)}
                            className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-sm"
                          >
                            {u.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">{u.email}</p>
                        </div>
                      </td>
                    )}
                    {visibleColumns.phone && <td className="text-xs">{u.phone || 'N/A'}</td>}
                    {visibleColumns.role && (
                      <td>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {u.roles?.[0]?.name ?? 'Staff'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleActiveMutation.mutate({ id: u.id, is_active: !u.is_active })}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            u.is_active
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{u.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <TableActionMenu
                          onView={() => setViewUser(u)}
                          onEdit={() => openEditModal(u)}
                          onDelete={() => setDeleteTarget(u)}
                          items={[
                            {
                              label: 'Manage Permissions',
                              icon: Key,
                              onClick: () => openPermissionModal(u),
                            },
                            {
                              label: 'Reset Password',
                              icon: Lock,
                              onClick: () => openResetPasswordModal(u),
                            },
                          ]}
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    </div>
  )
}

export default UserTableSection
