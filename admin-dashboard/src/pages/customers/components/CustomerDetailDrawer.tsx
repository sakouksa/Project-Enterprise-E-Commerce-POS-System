import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, Award, DollarSign, MapPin, CheckCircle2 } from 'lucide-react'
import type { Customer } from '../types'

interface CustomerDetailDrawerProps {
  customer: Customer | null
  onClose: () => void
  openEditModal: (cust: Customer) => void
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
  openEditModal,
}) => {
  return (
    <AnimatePresence>
      {customer && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end print:static print:bg-transparent">
          <div className="absolute inset-0 print:hidden" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="bg-card w-full max-w-xl h-full shadow-2xl relative z-10 p-6 flex flex-col justify-between overflow-y-auto print:static print:w-full print:p-0 print:shadow-none"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 print:hidden">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span>Customer Profile Details</span>
                </h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* Profile Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-purple-500/10 border border-blue-500/20 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                  {customer.photo ? (
                    <img src={customer.photo} alt={customer.name} className="w-full h-full object-cover" />
                  ) : (
                    customer.name[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">{customer.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{customer.group?.name || 'Standard Client'}</p>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    customer.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Contact & Financial Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="font-semibold text-foreground">{customer.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="font-semibold text-foreground">{customer.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="font-bold text-emerald-600 text-base">${customer.total_spent || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Order Count</p>
                    <p className="font-semibold text-foreground">{customer.order_count || 0} Orders</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loyalty Points</p>
                    <p className="font-semibold text-amber-500">{customer.loyalty_points || 0} PTS</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Credit Limit</p>
                    <p className="font-semibold text-foreground">${customer.credit_limit || 0}</p>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => { onClose(); openEditModal(customer); }}
                    className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end print:hidden">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border">
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CustomerDetailDrawer
