import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User as UserIcon, Mail, Phone, MapPin, Shield, Key, Lock, Clock, CheckCircle2 } from 'lucide-react'
import type { User } from '../types'

interface UserDetailDrawerProps {
  user: User | null
  onClose: () => void
  getAvatarUrl: (avatar?: string | null) => string | null
  openResetPasswordModal: (user: User) => void
  openPermissionModal: (user: User) => void
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  onClose,
  getAvatarUrl,
  openResetPasswordModal,
  openPermissionModal,
}) => {
  return (
    <AnimatePresence>
      {user && (
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
                  <Shield size={18} className="text-primary" />
                  <span>User Profile & Access Control</span>
                </h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* Profile Card Header */}
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center flex-shrink-0 shadow-xs">
                  {user.avatar ? (
                    <img src={getAvatarUrl(user.avatar) || ''} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={32} className="text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-foreground tracking-tight">{user.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      user.is_active
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {user.roles?.[0]?.name ?? 'Staff'}
                    </span>
                  </div>
                </div>
              </div>

              {/* General Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Personal & Contact Info</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Mail size={15} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-semibold text-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={15} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <p className="font-semibold text-foreground">{user.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <MapPin size={15} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location Address</p>
                      <p className="font-semibold text-foreground">
                        {[user.address, user.city, user.province, user.country].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1 pt-3">Security & Access Logs</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock size={15} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Login Activity</p>
                      <p className="font-semibold text-foreground">{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never Logged In'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Account Created</p>
                      <p className="font-semibold text-foreground">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => { onClose(); openPermissionModal(user); }}
                    className="flex-1 py-2 px-3 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Key size={14} className="text-primary" />
                    <span>Manage Roles & Rights</span>
                  </button>
                  <button
                    onClick={() => { onClose(); openResetPasswordModal(user); }}
                    className="flex-1 py-2 px-3 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Lock size={14} className="text-amber-500" />
                    <span>Reset Password</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end print:hidden">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border transition-colors">
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UserDetailDrawer
