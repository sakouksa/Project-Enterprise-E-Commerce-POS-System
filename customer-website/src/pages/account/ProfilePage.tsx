import React, { useState } from 'react'
import { useAuthStore } from '@/stores'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

const ProfilePage: React.FC = () => {
  const { customer, user, updateCustomer } = useAuthStore()

  const [name, setName]               = useState(customer?.name || '')
  const [phone, setPhone]             = useState(customer?.phone || '')
  const [loading, setLoading]         = useState(false)
  const [message, setMessage]         = useState<string | null>(null)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword]               = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [passLoading, setPassLoading]         = useState(false)
  const [passMessage, setPassMessage]         = useState<string | null>(null)
  const [passError, setPassError]             = useState<string | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await api.put('/auth/profile', { name, phone })
      updateCustomer({ name, phone })
      setMessage('Profile updated successfully!')
    } catch {
      setMessage('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      setPassError('Passwords do not match')
      return
    }

    setPassLoading(true)
    setPassError(null)
    setPassMessage(null)

    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      })
      setPassMessage('Password changed successfully!')
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (err: any) {
      setPassError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Details Card */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
          Personal Information
        </h3>

        {message && <div className="p-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium">{message}</div>}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email Address</label>
              <input type="email" readOnly value={user?.email || ''} className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-2.5 text-xs font-bold">
            {loading ? <Spinner size="sm" /> : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Security Card */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
          Change Password
        </h3>

        {passMessage && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium">{passMessage}</div>}
        {passError && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">{passError}</div>}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Current Password</label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">New Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Confirm New Password</label>
            <input type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="input" />
          </div>

          <button type="submit" disabled={passLoading} className="btn-primary py-2.5 text-xs font-bold">
            {passLoading ? <Spinner size="sm" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
