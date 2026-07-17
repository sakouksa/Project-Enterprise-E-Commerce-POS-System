import React from 'react'
import { Shield, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Pagination from '@/components/shared/Pagination'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

interface LoginHistoryTableProps {
  histories: any[]
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

export const LoginHistoryTable: React.FC<LoginHistoryTableProps> = ({
  histories,
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
            <Shield size={18} className="text-primary" />
            {t('profile.logins_tab.title', 'Session Login History')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('profile.logins_tab.subtitle', 'A comprehensive list of authentication attempts on your account.')}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('profile.logins_tab.search_placeholder', 'Search logins...')}
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
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t('profile.logins_tab.th_device', 'Device')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.logins_tab.th_browser', 'Browser')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.logins_tab.th_ip', 'IP Address')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.logins_tab.th_time', 'Login Time')}</th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.logins_tab.th_status', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isFetching && histories.length === 0 ? (
                <LoadingSkeleton cols={5} rows={perPage} />
              ) : (
                histories.map((h) => {
                  const dateStr = new Date(h.created_at).toLocaleString()
                  return (
                    <tr key={h.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 text-sm font-semibold text-foreground capitalize">
                        {h.device || 'Desktop'} ({h.platform || 'Unknown'})
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{h.browser || 'Unknown'}</td>
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{h.ip_address}</td>
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{dateStr}</td>
                      <td className="py-3 px-4 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                          h.success 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {h.success ? t('profile.logins_tab.status_success', 'Success') : t('profile.logins_tab.status_failed', 'Failed')}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
              {histories.length === 0 && !isFetching && (
                <EmptyState message={t('profile.logins_tab.no_logins', 'No login histories found.')} cols={5} />
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
