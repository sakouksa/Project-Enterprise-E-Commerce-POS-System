import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'

interface UserFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  roles?: any[]
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterRole: string
  setFilterRole: (val: string) => void
  filterStartDate: string
  setFilterStartDate: (val: string) => void
  filterEndDate: string
  setFilterEndDate: (val: string) => void
  filterVerified: string
  setFilterVerified: (val: string) => void
  filter2FA: string
  setFilter2FA: (val: string) => void
  onReset: () => void
}

export const UserFilterDrawer: React.FC<UserFilterDrawerProps> = ({
  isOpen,
  onClose,
  roles = [],
  filterStatus,
  setFilterStatus,
  filterRole,
  setFilterRole,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterVerified,
  setFilterVerified,
  filter2FA,
  setFilter2FA,
  onReset,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <h3 className="font-bold text-base text-foreground">Filter Users Directory</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-card">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Account Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Accounts</option>
                  <option value="inactive">Inactive Accounts</option>
                  <option value="blocked">Blocked / Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">System Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin / Super Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                  <option value="staff">Staff</option>
                  {roles.map((r: any) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Joined From Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Joined To Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Email Verification</label>
                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified Emails Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">2FA Authentication</label>
                <select
                  value={filter2FA}
                  onChange={(e) => setFilter2FA(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Users</option>
                  <option value="enabled">2FA Enabled</option>
                  <option value="disabled">2FA Disabled</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UserFilterDrawer
