import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const login    = useAuthStore((s) => s.login)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.data.access_token, data.data.user, data.data.customer)
      navigate('/account')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 space-y-6 shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-display">
          Welcome Back
        </h2>
        <p className="text-xs text-gray-500">Sign in to your customer account to continue</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Email Address
          </label>
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link to="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input pl-10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-blue-600 font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
