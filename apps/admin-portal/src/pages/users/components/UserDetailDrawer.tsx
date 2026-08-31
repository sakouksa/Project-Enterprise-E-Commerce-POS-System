import React from 'react'
import { Mail, Phone, MapPin, Shield, Key, Lock, Clock, CheckCircle2 } from 'lucide-react'
import { 
  StatusBadge, 
  UserAvatar, 
  DetailDrawer, 
  DetailDrawerHeader, 
  DetailDrawerBody, 
  DetailDrawerFooter 
} from '@/components/common'
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
    <DetailDrawer
      isOpen={!!user}
      onClose={onClose}
      size="xl"
    >
      <DetailDrawerHeader
        icon={<Shield size={20} />}
        iconVariant="primary"
        title="User Profile & Access Control"
        subtitle={user.email}
        badge={
          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-mono font-semibold border border-border/60">
            USR-#{String(user.id).padStart(4, '0')}
          </span>
        }
        onClose={onClose}
      />

      <DetailDrawerBody>
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 bg-muted/30 dark:bg-slate-800/40 p-4 rounded-2xl border border-border dark:border-slate-800">
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
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/60 pb-1">
            Personal & Contact Info
          </h4>
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

          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/60 pb-1 pt-3">
            Security & Access Logs
          </h4>
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
      </DetailDrawerBody>

      <DetailDrawerFooter
        onClose={onClose}
        closeLabel="Close"
        rightActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openResetPasswordModal(user)}
              className="px-3.5 py-2 text-xs font-bold bg-card hover:bg-muted text-foreground rounded-xl border border-border transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Key size={14} className="text-amber-500" />
              <span>Reset Password</span>
            </button>
            <button
              type="button"
              onClick={() => openPermissionModal(user)}
              className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Lock size={14} />
              <span>Permissions</span>
            </button>
          </div>
        }
      />
    </DetailDrawer>
  )
}

export default UserDetailDrawer
