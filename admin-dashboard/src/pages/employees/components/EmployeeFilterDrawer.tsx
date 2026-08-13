import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'

interface EmployeeFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  branchesList?: any[]
  deptList?: any[]
  posList?: any[]
  filterBranchId: string
  setFilterBranchId: (val: string) => void
  filterDeptId: string
  setFilterDeptId: (val: string) => void
  filterPosId: string
  setFilterPosId: (val: string) => void
  filterRole: string
  setFilterRole: (val: string) => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterGender: string
  setFilterGender: (val: string) => void
  filterDateStart: string
  setFilterDateStart: (val: string) => void
  filterDateEnd: string
  setFilterDateEnd: (val: string) => void
  filterSalaryMin: string
  setFilterSalaryMin: (val: string) => void
  filterSalaryMax: string
  setFilterSalaryMax: (val: string) => void
  onReset: () => void
}

export const EmployeeFilterDrawer: React.FC<EmployeeFilterDrawerProps> = ({
  isOpen,
  onClose,
  branchesList = [],
  deptList = [],
  posList = [],
  filterBranchId,
  setFilterBranchId,
  filterDeptId,
  setFilterDeptId,
  filterPosId,
  setFilterPosId,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  filterGender,
  setFilterGender,
  filterDateStart,
  setFilterDateStart,
  filterDateEnd,
  setFilterDateEnd,
  filterSalaryMin,
  setFilterSalaryMin,
  filterSalaryMax,
  setFilterSalaryMax,
  onReset,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            onClick={onClose}
          />
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <h3 className="font-bold text-base text-foreground">
                  Advanced Employee Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-card">
              {/* Branch Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Branch</label>
                <select
                  value={filterBranchId}
                  onChange={e => setFilterBranchId(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                >
                  <option value="">All Branches</option>
                  {branchesList.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Department</label>
                <select
                  value={filterDeptId}
                  onChange={e => setFilterDeptId(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {deptList.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Position Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Position</label>
                <select
                  value={filterPosId}
                  onChange={e => setFilterPosId(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                >
                  <option value="">All Positions</option>
                  {posList.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Role</label>
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* Employment Status Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Employment Status</label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="resigned">Resigned</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Gender</label>
                <select
                  value={filterGender}
                  onChange={e => setFilterGender(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Date Joined / Date Range Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Date Joined / Date Start</label>
                <input
                  type="date"
                  value={filterDateStart}
                  onChange={e => setFilterDateStart(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Date Joined / Date End</label>
                <input
                  type="date"
                  value={filterDateEnd}
                  onChange={e => setFilterDateEnd(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                />
              </div>

              {/* Basic Salary Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Min Salary ($)</label>
                  <input
                    type="number"
                    value={filterSalaryMin}
                    onChange={e => setFilterSalaryMin(e.target.value)}
                    placeholder="Min"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Max Salary ($)</label>
                  <input
                    type="number"
                    value={filterSalaryMax}
                    onChange={e => setFilterSalaryMax(e.target.value)}
                    placeholder="Max"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted border border-border rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EmployeeFilterDrawer
