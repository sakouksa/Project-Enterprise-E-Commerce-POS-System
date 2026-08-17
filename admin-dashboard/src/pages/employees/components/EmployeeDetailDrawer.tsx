import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User } from 'lucide-react'
import { EmployeeAvatar } from './EmployeeAvatar'

interface EmployeeDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedItem: any | null
  getPhotoUrl: (photoPath?: string) => string | null
}

export const EmployeeDetailDrawer: React.FC<EmployeeDetailDrawerProps> = ({
  isOpen,
  onClose,
  selectedItem,
  getPhotoUrl,
}) => {
  return (
    <AnimatePresence>
      {isOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end print:static print:bg-transparent">
          <div className="absolute inset-0 print:hidden" onClick={onClose} />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="bg-card w-full max-w-xl h-full shadow-2xl relative z-10 p-6 flex flex-col justify-between overflow-y-auto print:static print:w-full print:p-0 print:shadow-none"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 print:hidden">
                <h3 className="text-lg font-bold text-foreground">Employee Profile Card</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* Profile Card Header */}
              <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border">
                <EmployeeAvatar
                  photo={selectedItem.photo}
                  name={selectedItem.name}
                  id={selectedItem.id}
                  size="xl"
                  getPhotoUrl={getPhotoUrl}
                />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedItem.name}</h2>
                  <p className="font-mono text-xs text-muted-foreground">{selectedItem.employee_number}</p>
                  <span className={`badge mt-2 ${selectedItem.status === 'active' ? 'badge-success' : selectedItem.status === 'resigned' ? 'badge-danger' : 'badge-muted'}`}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              {/* Profile Info Details Grid */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase">General Information</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">National ID (NIK)</p>
                    <p className="font-semibold">{selectedItem.nik ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender / Birth Date</p>
                    <p className="font-semibold capitalize">
                      {selectedItem.gender ?? '-'} {selectedItem.birth_date ? `| ${new Date(selectedItem.birth_date).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-primary">{selectedItem.email ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedItem.phone ?? '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Home Address</p>
                    <p className="font-semibold">{selectedItem.address ?? '-'}</p>
                  </div>
                </div>

                <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase pt-4">Employment Details</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Branch</p>
                    <p className="font-semibold">{selectedItem.branch?.name ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="font-semibold">{selectedItem.company?.name ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-semibold">{selectedItem.department?.name ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="font-semibold">{selectedItem.position?.name ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Basic Salary</p>
                    <p className="font-semibold font-mono text-primary text-base">${Number(selectedItem.basic_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Join Date / Resign Date</p>
                    <p className="font-semibold">
                      {selectedItem.join_date ? new Date(selectedItem.join_date).toLocaleDateString() : '-'}
                      {selectedItem.resign_date ? ` / ${new Date(selectedItem.resign_date).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                </div>

                <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase pt-4">Workplace Summary</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Attendance Summary</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedItem.attendance_count ?? 0} Check-ins</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payroll Summary</p>
                    <p className="font-semibold text-primary">{selectedItem.payroll_count ?? 0} Pay slips</p>
                  </div>
                </div>

                <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase pt-4">System Metadata</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs">Record Created</p>
                    <p className="text-xs font-semibold">{new Date(selectedItem.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs">Record Updated</p>
                    <p className="text-xs font-semibold">{new Date(selectedItem.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex gap-2 justify-end print:hidden">
              <button onClick={onClose} className="btn btn-secondary">Close Profile</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EmployeeDetailDrawer
