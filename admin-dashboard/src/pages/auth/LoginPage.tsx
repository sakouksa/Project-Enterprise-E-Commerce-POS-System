import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Store, ShieldAlert, UserCheck } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/client'

const schema = z.object({
  username: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, 'Email, Username, or Employee Number is required')
        .min(2, 'Input must be at least 2 characters')
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof schema>

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError]   = useState<string | null>(null)
  const { setAuth }                     = useAuthStore()
  const navigate                        = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '', remember: true },
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError(null)
      const res = await api.post('/auth/login', {
        username: data.username,
        password: data.password,
        remember: data.remember ?? false,
      })

      const { user, access_token, token, refresh_token } = res.data.data
      const effectiveToken = access_token || token

      setAuth(user, effectiveToken, refresh_token)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please verify your credentials.'
      setServerError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-glow">
              <Store size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise POS</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in with your email or account credentials</p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-2.5 shadow-sm"
            >
              <ShieldAlert size={18} className="text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1 font-medium">{serverError}</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email, Username or Employee Number */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck size={15} className="text-blue-400" />
                Email, Username or Employee Number
              </label>
              <input
                {...register('username')}
                type="text"
                autoComplete="username"
                placeholder="e.g. admin@enterprise-pos.com or admin or EMP-0001"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white
                           placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                           focus:border-blue-500/50 transition-all text-sm"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="•••••••• (e.g. password)"
                  className="w-full px-4 py-2.5 pr-11 bg-white/5 border border-white/10 rounded-lg text-white
                             placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                             focus:border-blue-500/50 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Device */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-sm text-slate-300">Remember Device</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold
                         rounded-lg hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50 transition-all duration-200 flex items-center justify-center
                         gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 border-t border-white/5 pt-4">
            Demo Logins: Email <span className="font-semibold text-slate-200">admin@enterprise-pos.com</span> or Username{' '}
            <span className="font-semibold text-slate-200">admin</span> | Password:{' '}
            <span className="font-semibold text-slate-200">password</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
