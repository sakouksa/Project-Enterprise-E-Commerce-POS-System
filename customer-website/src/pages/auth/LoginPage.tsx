import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores'
import authService from '@/services/authService'
import Spinner from '@/components/ui/Spinner'
import Input from '@/components/ui/Input'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await authService.login({ email, password })
      const data = res.data || res
      login(data.access_token, data.user, data.customer)
      navigate('/account')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 space-y-6 shadow-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to your customer account to continue
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-100 dark:border-rose-900/50">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@example.com"
          icon={<Mail className="w-4 h-4" />}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg rounded-2xl cursor-pointer"
        >
          {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
