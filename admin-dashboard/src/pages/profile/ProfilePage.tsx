import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { profileService } from '@/services/profileService'
import type { UserProfile } from '@/services/profileService'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileOverview } from './components/ProfileOverview'
import { PersonalInfoForm } from './components/PersonalInfoForm'
import { SecurityTab } from './components/SecurityTab'
import { PermissionTable } from './components/PermissionTable'
import { ActivityLogTable } from './components/ActivityLogTable'
import { LoginHistoryTable } from './components/LoginHistoryTable'
import { ProfileSettings } from './components/ProfileSettings'
import { useServerPagination } from '@/hooks/useServerPagination'
import { LoadingSpinner } from '@/components/common'

const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'security' | 'permissions' | 'activities' | 'logins' | 'settings'>('overview')

  // Pagination for Activity Logs
  const actPage = useServerPagination({ storageKey: 'profile-activity-logs' })
  // Pagination for Login History
  const loginPage = useServerPagination({ storageKey: 'profile-login-histories' })

  // Preferences State
  const [timezone, setTimezone] = useState('UTC')
  const [emailNotify, setEmailNotify] = useState(true)
  const [pushNotify, setPushNotify] = useState(true)
  const [smsNotify, setSmsNotify] = useState(false)

  // Sync preference states when profile is loaded
  const { data: profile, isLoading: isProfileLoading } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  })

  useEffect(() => {
    if (profile) {
      setTimezone(profile.timezone ?? 'UTC')
      setEmailNotify(profile.email_notify ?? true)
      setPushNotify(profile.push_notify ?? true)
      setSmsNotify(profile.sms_notify ?? false)
    }
  }, [profile])

  const { data: permissionsData } = useQuery<any>({
    queryKey: ['profile-permissions'],
    queryFn: () => profileService.getPermissions(),
    enabled: activeTab === 'permissions' || activeTab === 'overview',
  })

  const { data: activityLogsData, isFetching: isFetchingLogs } = useQuery({
    queryKey: ['profile-activity-logs', actPage.page, actPage.perPage, actPage.debouncedSearch],
    queryFn: () => profileService.getActivityLogs({
      page: actPage.page,
      per_page: actPage.perPage,
      search: actPage.debouncedSearch
    }),
    enabled: activeTab === 'activities' || activeTab === 'overview',
  })

  const { data: loginHistoryData, isFetching: isFetchingLogins } = useQuery({
    queryKey: ['profile-login-histories', loginPage.page, loginPage.perPage, loginPage.debouncedSearch],
    queryFn: () => profileService.getLoginHistory({
      page: loginPage.page,
      per_page: loginPage.perPage,
      search: loginPage.debouncedSearch
    }),
    enabled: activeTab === 'logins' || activeTab === 'overview',
  })

  // ─── Mutations ────────────────────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (updatedUser) => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      useAuthStore.getState().updateUser(updatedUser as any)
      toast.success(t('profile.personal_tab.success_update', 'Personal details updated successfully.'))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('profile.personal_tab.fail_update', 'Failed to update personal details.'))
    }
  })

  const avatarUploadMutation = useMutation({
    mutationFn: profileService.uploadAvatar,
    onSuccess: (avatarUrl) => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      useAuthStore.getState().updateUser({ avatar: avatarUrl })
      toast.success(t('profile.avatar.upload_success', 'Avatar uploaded successfully.'))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('profile.avatar.upload_fail', 'Failed to upload avatar.'))
    }
  })

  const avatarRemoveMutation = useMutation({
    mutationFn: profileService.removeAvatar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      useAuthStore.getState().updateUser({ avatar: null })
      toast.success(t('profile.avatar.remove_success', 'Avatar removed successfully.'))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('profile.avatar.remove_fail', 'Failed to remove avatar.'))
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => {
      toast.success(t('profile.security_tab.password_success', 'Password changed successfully.'))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('profile.security_tab.password_fail', 'Failed to change password.'))
    }
  })

  const logoutDevicesMutation = useMutation({
    mutationFn: profileService.logoutOtherDevices,
    onSuccess: () => {
      toast.success(t('profile.security_tab.revoke_success', 'Logged out other devices successfully.'))
      qc.invalidateQueries({ queryKey: ['profile-sessions'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('profile.security_tab.revoke_fail', 'Failed to log out other devices.'))
    }
  })

  // Mock Active Sessions derived from current session & login history for visual engagement
  const activeSessions = profile ? [
    {
      id: 1,
      ip_address: profile.last_login_at ? '127.0.0.1' : '192.168.1.1',
      browser: 'Chrome',
      device: 'Desktop',
      platform: 'Windows',
      last_activity: profile.last_login_at || new Date().toISOString(),
      is_current: true
    }
  ] : []

  if (isProfileLoading || !profile) {
    return <LoadingSpinner fullPage label={t('profile.loading_specs', 'Loading profile specifications...')} />
  }

  const handleUpdateProfile = (data: any) => {
    updateProfileMutation.mutate(data)
  }

  const handleAvatarUpload = (file: File) => {
    avatarUploadMutation.mutate(file)
  }

  const handleAvatarRemove = () => {
    avatarRemoveMutation.mutate()
  }

  const handleChangePassword = (data: any) => {
    changePasswordMutation.mutate(data)
  }

  const handleLogoutOtherDevices = () => {
    logoutDevicesMutation.mutate()
  }

  const handleSavePreferences = () => {
    updateProfileMutation.mutate({
      timezone,
      language: localStorage.getItem('enterprise-pos-lang') || 'en',
      email_notify: emailNotify,
      push_notify: pushNotify,
      sms_notify: smsNotify,
    })
  }

  const tabs = [
    { id: 'overview', label: t('profile.overview', 'Overview') },
    { id: 'personal', label: t('profile.personal_information', 'Personal Information') },
    { id: 'security', label: t('profile.security', 'Security') },
    { id: 'permissions', label: t('profile.permissions', 'Permissions') },
    { id: 'activities', label: t('profile.activity_logs', 'Activity Logs') },
    { id: 'logins', label: t('profile.login_history', 'Login History') },
    { id: 'settings', label: t('profile.settings', 'Settings') }
  ] as const

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground font-semibold">{t('profile.title', 'Account & Profile Settings')}</h1>
        <p className="text-sm text-muted-foreground">{t('profile.subtitle', 'Manage your identity, settings, preferences, and session security.')}</p>
      </div>

      {/* Profile Header Card */}
      <ProfileHeader
        profile={profile}
        onAvatarUpload={handleAvatarUpload}
        onAvatarRemove={handleAvatarRemove}
        isUploading={avatarUploadMutation.isPending}
        onEditClick={() => setActiveTab('personal')}
        onChangePasswordClick={() => setActiveTab('security')}
      />

      {/* Tabs Layout */}
      <div className="flex flex-col gap-6">
        <div className="border-b border-border overflow-x-auto no-scrollbar">
          <nav className="flex gap-6 min-w-max pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Body */}
        <div className="mt-2">
          {activeTab === 'overview' && (
            <ProfileOverview
              profile={profile}
              activities={activityLogsData?.data ?? []}
              permissionsCount={permissionsData?.data?.permissions?.length ?? 0}
              loginCount={loginHistoryData?.pagination?.total ?? 0}
            />
          )}

          {activeTab === 'personal' && (
            <PersonalInfoForm
              profile={profile}
              onSave={handleUpdateProfile}
              isSaving={updateProfileMutation.isPending}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              sessions={activeSessions}
              onChangePassword={handleChangePassword}
              isChangingPassword={changePasswordMutation.isPending}
              onLogoutOtherDevices={handleLogoutOtherDevices}
              isLoggingOutDevices={logoutDevicesMutation.isPending}
            />
          )}

          {activeTab === 'permissions' && (
            <PermissionTable
              roles={permissionsData?.data?.roles ?? []}
              permissions={permissionsData?.data?.permissions ?? []}
            />
          )}

          {activeTab === 'activities' && (
            <ActivityLogTable
              logs={activityLogsData?.data ?? []}
              pagination={activityLogsData?.pagination ?? { current_page: 1, last_page: 1, total: 0 }}
              page={actPage.page}
              setPage={actPage.setPage}
              perPage={actPage.perPage}
              setPerPage={actPage.setPerPage}
              search={actPage.search}
              setSearch={actPage.setSearch}
              isFetching={isFetchingLogs}
            />
          )}

          {activeTab === 'logins' && (
            <LoginHistoryTable
              histories={loginHistoryData?.data ?? []}
              pagination={loginHistoryData?.pagination ?? { current_page: 1, last_page: 1, total: 0 }}
              page={loginPage.page}
              setPage={loginPage.setPage}
              perPage={loginPage.perPage}
              setPerPage={loginPage.setPerPage}
              search={loginPage.search}
              setSearch={loginPage.setSearch}
              isFetching={isFetchingLogins}
            />
          )}

          {activeTab === 'settings' && (
            <ProfileSettings
              timezone={timezone}
              setTimezone={setTimezone}
              emailNotify={emailNotify}
              setEmailNotify={setEmailNotify}
              pushNotify={pushNotify}
              setPushNotify={setPushNotify}
              smsNotify={smsNotify}
              setSmsNotify={setSmsNotify}
              onSave={handleSavePreferences}
              isSaving={updateProfileMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
