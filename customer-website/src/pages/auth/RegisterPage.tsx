import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const login    = useAuthStore((s) => s.login)

  const [formData, setFormData] = useState({
    name:                  '',
    email:                 '',
    phone:                 '',
    password:              '',
    password_confirmation: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

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
      const { data } = await api.post('/auth/register', formData)
      login(data.data.access_token, data.data.user, data.data.customer)
      navigate('/account')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 space-y-6 shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-display">
          Create Account
        </h2>
        <p className="text-xs text-gray-500">Join ShopKh to track orders, save wishlists, and earn points</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Sok Dara"
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@example.com"
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="012 345 678"
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Confirm Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="password"
              name="password_confirmation"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Repeat password"
              className="input pl-10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-blue-600 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
