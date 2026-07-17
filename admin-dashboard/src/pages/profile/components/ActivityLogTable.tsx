import React, { useState } from 'react'
import { Activity, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Pagination from '@/components/shared/Pagination'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

interface ActivityLogTableProps {
  logs: any[]
  pagination: {
    current_page: number
    last_page: number
    total: number
  }
  page: number
  setPage: (page: number) => void
  perPage: number
  setPerPage: (perPage: number) => void
  search: string
  setSearch: (search: string) => void
  isFetching: boolean
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({
  logs,
  pagination,
  page,
  setPage,
  perPage,
  setPerPage,
  search,
  setSearch,
  isFetching,
}) => {
  const { t } = useTranslation()
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            {t('profile.activities_tab.title', 'Security & Audit Activity Logs')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('profile.activities_tab.subtitle', 'A history of administrative and critical operations performed by your session.')}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('profile.activities_tab.search_placeholder', 'Search actions...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/35 placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden border border-border rounded-xl">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t('profile.activities_tab.th_date', 'Date & Time')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.activities_tab.th_action', 'Action')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.activities_tab.th_module', 'Module')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.activities_tab.th_ip', 'IP Address')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.activities_tab.th_ua', 'User Agent')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isFetching && logs.length === 0 ? (
                <LoadingSkeleton cols={5} rows={perPage} />
              ) : (
                logs.map((log) => {
                  const dateStr = new Date(log.created_at).toLocaleString()
                  const ip = log.properties?.ip ?? 'N/A'
                  const ua = log.properties?.user_agent ?? 'N/A'
                  
                  return (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{dateStr}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-foreground capitalize">{log.description}</td>
                      <td className="py-3 px-4 text-xs">
                        <span className="px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary uppercase tracking-wide">
                          {log.log_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{ip}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground truncate max-w-xs" title={ua}>
                        {ua}
                      </td>
                    </tr>
                  )
                })
              )}
              {logs.length === 0 && !isFetching && (
                <EmptyState message={t('profile.activities_tab.no_logs', 'No activity logs found.')} cols={5} />
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        isLoading={isFetching}
      />
    </div>
  )
}
