import React, { useState } from 'react'
import { Shield, Search, Key, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import EmptyState from '@/components/shared/EmptyState'

interface PermissionItem {
  id: string
  name: string
  group?: string
  module: string
  action: string
  guard_name: string
}

interface PermissionTableProps {
  roles: string[]
  permissions: PermissionItem[]
}

export const PermissionTable: React.FC<PermissionTableProps> = ({
  roles = [],
  permissions = [],
}) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  // Filter permissions
  const filtered = permissions.filter((perm) => {
    const term = search.toLowerCase()
    return (
      perm.name.toLowerCase().includes(term) ||
      (perm.group || '').toLowerCase().includes(term)
    );
  })

  return (
    <div className="space-y-6">
      {/* Roles Summary Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield size={18} className="text-primary" />
          {t('profile.permissions_tab.assigned_roles', 'Assigned Roles')}
        </h3>
        {roles.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('profile.permissions_tab.no_roles', 'No roles assigned')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-xl text-sm font-semibold bg-primary/10 text-primary border border-primary/20 capitalize"
              >
                {role.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Permissions Table Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Key size={18} className="text-primary" />
              {t('profile.permissions_tab.effective_title', 'Effective System Permissions')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('profile.permissions_tab.effective_subtitle', 'These permissions are inherited through your assigned roles or direct grants.')}
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('profile.permissions_tab.search_placeholder', 'Search permissions...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/35 placeholder:text-muted-foreground transition-all"
            />
          </div>
        </div>

        {/* Table wrapper */}
        <div className="overflow-hidden border border-border rounded-xl">
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t('profile.permissions_tab.th_name', 'Permission Name')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t('profile.permissions_tab.th_module', 'Module')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t('profile.permissions_tab.th_action', 'Action')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t('profile.permissions_tab.th_guard', 'Guard')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((perm) => {
                const action = perm.name.split('_')[0] || perm.name
                return (
                  <tr key={perm.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-sm font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 flex-shrink-0" />
                        {perm.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                        {perm.group || 'system'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs capitalize text-muted-foreground font-medium">{action}</td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{perm.guard_name}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <EmptyState message={t('profile.permissions_tab.no_match', 'No permissions match your search query.')} cols={4} />
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
