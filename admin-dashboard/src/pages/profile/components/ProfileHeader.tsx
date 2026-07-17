import React, { useRef } from 'react'
import { User, Mail, Phone, Shield, Building2, Calendar, Camera, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UserProfile } from '@/services/profileService'

interface ProfileHeaderProps {
  profile: UserProfile
  onAvatarUpload: (file: File) => void
  onAvatarRemove: () => void
  isUploading: boolean
  onEditClick: () => void
  onChangePasswordClick: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onAvatarUpload,
  onAvatarRemove,
  isUploading,
  onEditClick,
  onChangePasswordClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarUpload(e.target.files[0])
    }
  }

  const roleName = profile.roles?.[0] ? profile.roles[0].replace('_', ' ') : 'User'

  return (
    <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-6 shadow-sm overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
        
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center shadow-lg relative">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary text-3xl font-bold">{profile.name?.[0] ?? 'U'}</span>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* Avatar Actions Overlay */}
          <div className="absolute -bottom-2 -right-2 flex gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-primary hover:bg-primary/95 text-white rounded-full shadow-md transition-all duration-200"
              title={t('profile.avatar.upload', 'Upload Avatar')}
            >
              <Camera size={14} />
            </button>
            {profile.avatar && (
              <button
                onClick={onAvatarRemove}
                className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-md transition-all duration-200"
                title={t('profile.avatar.remove', 'Remove Avatar')}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* User Info Details */}
        <div className="flex-1 text-center lg:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{profile.name}</h2>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                  <Shield size={12} />
                  {roleName}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  profile.is_active 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {profile.is_active ? t('profile.overview_tab.active', 'Active') : t('profile.overview_tab.inactive', 'Inactive')}
                </span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={onEditClick}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl text-sm font-medium border border-border transition-colors duration-200 shadow-sm"
              >
                {t('profile.personal_information', 'Personal Information')}
              </button>
              <button
                onClick={onChangePasswordClick}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                {t('profile.change_password', 'Change Password')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 pt-3 border-t border-border/40 text-sm text-muted-foreground">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Mail size={14} className="text-muted-foreground/75" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Phone size={14} className="text-muted-foreground/75" />
              <span>{profile.phone ?? t('profile.personal_tab.no_phone', 'No phone added')}</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Building2 size={14} className="text-muted-foreground/75" />
              <span>
                {profile.company?.name ?? t('profile.personal_tab.no_company', 'No company')}
                {profile.branch?.name ? ` • ${profile.branch.name}` : ''}
              </span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Calendar size={14} className="text-muted-foreground/75" />
              <span>
                {t('profile.joined_date', 'Joined')} {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {profile.last_login_at && (
              <div className="flex items-center justify-center lg:justify-start gap-2 col-span-1 md:col-span-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {t('profile.last_login', 'Last login:')} {new Date(profile.last_login_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
