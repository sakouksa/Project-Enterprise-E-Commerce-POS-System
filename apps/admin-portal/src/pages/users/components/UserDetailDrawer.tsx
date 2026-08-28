import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, MapPin, Shield, Key, Lock, Clock, CheckCircle2 } from 'lucide-react'
import StatusBadge from '@/components/common/StatusBadge'
import UserAvatar from '@/components/common/UserAvatar'
import type { User } from '../types'

interface UserDetailDrawerProps {
  user: User | null
  onClose: () => void
  getAvatarUrl?: (avatar?: string | null) => string | null
  openResetPasswordModal: (user: User) => void
  openPermissionModal: (user: User) => void
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  onClose,
  openResetPasswordModal,
  openPermissionModal,
}) => {
  if (!user) return null

  return (
    <AnimatePresence>
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
              <UserAvatar
                src={user.avatar}
                name={user.name}
                sizeClassName="w-16 h-16"
              />
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">{user.name}</h2>
                <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <StatusBadge status={user.is_active} />
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
            </div>
          </div>

          {/* Actions Bottom Bar */}
          <div className="border-t pt-4 flex gap-3 print:hidden">
            <button
              onClick={() => openResetPasswordModal(user)}
              className="flex-1 btn btn-outline btn-sm gap-2"
            >
              <Key size={14} />
              <span>Reset Password</span>
            </button>
            <button
              onClick={() => openPermissionModal(user)}
              className="flex-1 btn btn-primary btn-sm gap-2"
            >
              <Lock size={14} />
              <span>Permissions</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UserDetailDrawer
