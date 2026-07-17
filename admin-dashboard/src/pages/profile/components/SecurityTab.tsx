import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { KeyRound, ShieldAlert, Monitor, LogOut, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const passwordSchema = z.object({
  current_password: z.string().min(1, 'profile.security_tab.current_password_required'),
  new_password: z.string().min(8, 'profile.security_tab.password_length'),
  new_password_confirmation: z.string().min(1, 'profile.security_tab.confirm_password_required'),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: 'profile.security_tab.password_mismatch',
  path: ['new_password_confirmation'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

interface ActiveSession {
  id: number
  ip_address: string
  browser: string
  device: string
  platform: string
  last_activity: string
  is_current: boolean
}

interface SecurityTabProps {
  sessions: ActiveSession[]
  onChangePassword: (data: PasswordFormData) => void
  isChangingPassword: boolean
  onLogoutOtherDevices: () => void
  isLoggingOutDevices: boolean
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  sessions = [],
  onChangePassword,
  onLogoutOtherDevices,
  isChangingPassword,
  isLoggingOutDevices,
}) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const newPassword = watch('new_password', '')
  const [strengthScore, setStrengthScore] = useState(0)

  useEffect(() => {
    let score = 0
    if (newPassword.length >= 8) score += 1
    if (/[A-Z]/.test(newPassword)) score += 1
    if (/[a-z]/.test(newPassword)) score += 1
    if (/[0-9]/.test(newPassword)) score += 1
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1
    setStrengthScore(score)
  }, [newPassword])

  const getStrengthInfo = () => {
    if (strengthScore <= 1) return { label: t('profile.security_tab.strength_too_weak', 'Too Weak'), color: 'bg-red-500', text: 'text-red-500' }
    if (strengthScore === 2) return { label: t('profile.security_tab.strength_weak', 'Weak'), color: 'bg-orange-500', text: 'text-orange-500' }
    if (strengthScore === 3) return { label: t('profile.security_tab.strength_fair', 'Fair'), color: 'bg-amber-500', text: 'text-amber-500' }
    if (strengthScore === 4) return { label: t('profile.security_tab.strength_strong', 'Strong'), color: 'bg-blue-500', text: 'text-blue-500' }
    return { label: t('profile.security_tab.strength_very_strong', 'Very Strong'), color: 'bg-emerald-500', text: 'text-emerald-500' }
  }

  const strength = getStrengthInfo()

  const onSubmitPassword = (data: PasswordFormData) => {
    onChangePassword(data)
    reset()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit(onSubmitPassword)}
        className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6 h-fit"
      >
        <h3 className="text-lg font-bold text-foreground pb-4 border-b border-border/40 flex items-center gap-2">
          <KeyRound size={18} className="text-primary" />
          {t('profile.security_tab.credentials_title', 'Update Security Credentials')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              {t('profile.security_tab.current_password', 'Current Password')}
            </label>
            <input
              type="password"
              {...register('current_password')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.current_password ? 'border-red-500 focus:ring-red-500/20' : 'border-border'
              }`}
            />
            {errors.current_password && (
              <p className="text-xs text-red-500 mt-1">{t(errors.current_password.message || '')}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              {t('profile.security_tab.new_password', 'New Password')}
            </label>
            <input
              type="password"
              {...register('new_password')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.new_password ? 'border-red-500 focus:ring-red-500/20' : 'border-border'
              }`}
            />
            {errors.new_password && (
              <p className="text-xs text-red-500 mt-1">{t(errors.new_password.message || '')}</p>
            )}

            {newPassword && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t('profile.security_tab.strength', 'Strength')}:</span>
                  <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${Math.max(15, (strengthScore / 5) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              {t('profile.security_tab.confirm_password', 'Confirm New Password')}
            </label>
            <input
              type="password"
              {...register('new_password_confirmation')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.new_password_confirmation ? 'border-red-500 focus:ring-red-500/20' : 'border-border'
              }`}
            />
            {errors.new_password_confirmation && (
              <p className="text-xs text-red-500 mt-1">{t(errors.new_password_confirmation.message || '')}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/40">
          <button
            type="submit"
            disabled={isChangingPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold transition-colors duration-200 shadow-sm disabled:opacity-50"
          >
            {isChangingPassword ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <KeyRound size={16} />
            )}
            {t('profile.security_tab.change_password_btn', 'Change Password')}
          </button>
        </div>
      </form>

      {/* Active Sessions Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Monitor size={18} className="text-primary" />
            {t('profile.security_tab.sessions_title', 'Active Sessions Manager')}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {t('profile.security_tab.sessions_subtitle', 'These are the devices currently authenticated to your account.')}
          </p>
        </div>

        {sessions.length > 0 ? (
          <div className="divide-y divide-border/40">
            {sessions.map((sess) => (
              <div key={sess.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className="p-2.5 bg-secondary text-primary rounded-xl mt-0.5">
                  <Monitor size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {sess.platform} ({sess.device})
                    </h4>
                    {sess.is_current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase tracking-wide">
                        {t('profile.security_tab.current_session', 'Current Session')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    IP: <span className="font-mono">{sess.ip_address}</span> • Browser: {sess.browser}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 mt-1">
                    Last active: {new Date(sess.last_activity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/40">
            <ShieldAlert size={36} className="mb-2" />
            <p className="text-xs">{t('profile.security_tab.no_sessions', 'No active sessions.')}</p>
          </div>
        )}

        {sessions.length > 1 && (
          <button
            onClick={onLogoutOtherDevices}
            disabled={isLoggingOutDevices}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200/50 hover:bg-red-500/5 text-red-600 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {isLoggingOutDevices ? (
              <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut size={13} />
            )}
            {t('profile.logout_other_devices', 'Revoke Other Sessions')}
          </button>
        )}
      </div>
    </div>
  )
}
