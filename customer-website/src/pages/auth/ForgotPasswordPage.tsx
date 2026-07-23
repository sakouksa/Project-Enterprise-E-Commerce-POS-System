import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 space-y-6 shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-display">
          Reset Password
        </h2>
        <p className="text-xs text-gray-500">Enter your email and we'll send you a password reset link</p>
      </div>

      {sent ? (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs text-center space-y-2">
          <p className="font-bold">Reset link sent!</p>
          <p>If an account exists for {email}, you will receive a password reset link shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">{error}</div>}

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="input pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {loading ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link to="/auth/login" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
