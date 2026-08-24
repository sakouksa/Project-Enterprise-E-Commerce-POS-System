import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores'
import authService from '@/services/authService'
import Spinner from '@/components/ui/Spinner'
import Input from '@/components/ui/Input'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await authService.register(formData)
      const data = res.data || res
      login(data.access_token, data.user, data.customer)
      navigate('/account')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 space-y-6 shadow-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
          Create Account
        </h2>
        <p className="text-xs text-slate-500">
          Join Enterprise Store to track orders, save wishlists, and earn points
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-100 dark:border-rose-900/50">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name *"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Sok Dara"
          icon={<User className="w-4 h-4" />}
        />

        <Input
          label="Email Address *"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="customer@example.com"
          icon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="012 345 678"
          icon={<Phone className="w-4 h-4" />}
        />

        <Input
          label="Password *"
          type="password"
          name="password"
          required
          minLength={8}
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          icon={<Lock className="w-4 h-4" />}
        />

        <Input
          label="Confirm Password *"
          type="password"
          name="password_confirmation"
          required
          value={formData.password_confirmation}
          onChange={handleChange}
          placeholder="Repeat password"
          icon={<Lock className="w-4 h-4" />}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg rounded-2xl cursor-pointer"
        >
          {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
          <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
