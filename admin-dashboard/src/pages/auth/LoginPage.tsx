import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Headphones,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Package,
  CreditCard,
  X,
  ChevronDown,
  Check,
  AlertTriangle,
  Info,
  Globe,
  LogIn,
  Send,
  RefreshCw,
  Mail,
  KeyRound,
  Zap,
  Building2,
  Clock
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useCompanyStore } from '@/stores/companyStore'
import { BrandLogo } from '@/components/common/BrandLogo'
import api from '@/api/client'

// ─── Pure Vector SVG Country Flag Component ───────────────────────────────────
const CountryFlagIcon: React.FC<{ code: string; className?: string }> = ({ code, className = 'w-5 h-3.5' }) => {
  switch (code) {
    case 'km':
      return (
        <svg viewBox="0 0 640 480" className={`rounded-sm object-cover shadow-sm shrink-0 border border-slate-200/50 dark:border-slate-700/50 ${className}`}>
          <rect width="640" height="480" fill="#003893" />
          <rect y="120" width="640" height="240" fill="#E00025" />
          <g fill="#FFFFFF">
            <path d="M320 160 L300 200 L308 200 L308 320 L332 320 L332 200 L340 200 Z" />
            <path d="M260 210 L248 240 L254 240 L254 320 L274 320 L274 240 L280 240 Z" />
            <path d="M380 210 L368 240 L374 240 L374 320 L394 320 L394 240 L400 240 Z" />
            <rect x="220" y="300" width="200" height="20" />
            <rect x="230" y="280" width="180" height="20" />
            <rect x="240" y="260" width="160" height="20" />
          </g>
        </svg>
      )
    case 'en':
      return (
        <svg viewBox="0 0 640 480" className={`rounded-sm object-cover shadow-sm shrink-0 border border-slate-200/50 dark:border-slate-700/50 ${className}`}>
          <rect width="640" height="480" fill="#BB133E" />
          <path d="M0 36.9h640M0 110.8h640M0 184.6h640M0 258.5h640M0 332.3h640M0 406.2h640" stroke="#FFF" strokeWidth="36.9" />
          <rect width="256" height="258.5" fill="#002147" />
          <circle cx="64" cy="64" r="10" fill="#FFF" />
          <circle cx="128" cy="64" r="10" fill="#FFF" />
          <circle cx="192" cy="64" r="10" fill="#FFF" />
          <circle cx="96" cy="128" r="10" fill="#FFF" />
          <circle cx="160" cy="128" r="10" fill="#FFF" />
          <circle cx="64" cy="192" r="10" fill="#FFF" />
          <circle cx="128" cy="192" r="10" fill="#FFF" />
          <circle cx="192" cy="192" r="10" fill="#FFF" />
        </svg>
      )
    case 'th':
      return (
        <svg viewBox="0 0 640 480" className={`rounded-sm object-cover shadow-sm shrink-0 border border-slate-200/50 dark:border-slate-700/50 ${className}`}>
          <rect width="640" height="480" fill="#A51931" />
          <rect y="80" width="640" height="320" fill="#F4F5F8" />
          <rect y="160" width="640" height="160" fill="#2D2A4A" />
        </svg>
      )
    case 'vi':
      return (
        <svg viewBox="0 0 640 480" className={`rounded-sm object-cover shadow-sm shrink-0 border border-slate-200/50 dark:border-slate-700/50 ${className}`}>
          <rect width="640" height="480" fill="#DA251D" />
          <polygon fill="#FFFF00" points="320,120 348,208 440,208 366,262 394,350 320,296 246,350 274,262 200,208 292,208" />
        </svg>
      )
    case 'zh':
      return (
        <svg viewBox="0 0 640 480" className={`rounded-sm object-cover shadow-sm shrink-0 border border-slate-200/50 dark:border-slate-700/50 ${className}`}>
          <rect width="640" height="480" fill="#DE2910" />
          <polygon fill="#FFDE00" points="100,60 115,105 160,105 124,132 138,177 100,150 62,177 76,132 40,105 85,105" />
        </svg>
      )
    default:
      return <Globe className={className} />
  }
}

// ─── Supported Languages Configuration ───────────────────────────────────────
const LANGUAGES = [
  { code: 'en', name: 'English', label: 'English' },
  { code: 'km', name: 'Khmer', label: 'ភាសាខ្មែរ' },
  { code: 'th', name: 'Thai', label: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', label: 'Tiếng Việt' },
  { code: 'zh', name: 'Chinese', label: '中文' },
] as const

type LanguageCode = (typeof LANGUAGES)[number]['code']

// ─── Form Validation Schema ──────────────────────────────────────────────────
const schema = z.object({
  username: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, 'identifierRequired')
        .min(2, 'identifierMinLength')
    ),
  password: z
    .string()
    .min(1, 'passwordRequired')
    .min(4, 'passwordMinLength'),
  remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof schema>

const LoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common', 'errors'])
  const navigate = useNavigate()

  const { setAuth } = useAuthStore()
  const { themeMode, language, setLanguage, updateThemeMode } = useThemeStore()
  const { branding, fetchBranding } = useCompanyStore()

  useEffect(() => {
    fetchBranding()
  }, [fetchBranding])

  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)

  // Dropdown toggles
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)

  // Login execution state
  const [loginProgress, setLoginProgress] = useState(0)
  const [isSuccessState, setIsSuccessState] = useState(false)
  const [serverError, setServerError] = useState<{
    code?: number
    title: string
    message: string
  } | null>(null)

  // Modals state
  const [activeModal, setActiveModal] = useState<'forgot' | 'support' | 'terms' | 'privacy' | null>(null)

  // ─── FORGOT PASSWORD MODAL STATE + LIVE OTP EXPIRY COUNTDOWN TIMER ──────
  const [forgotStep, setForgotStep] = useState<1 | 2>(1)
  const [forgotIdentifier, setForgotIdentifier] = useState('')
  const [forgotOtpToken, setForgotOtpToken] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('')
  const [forgotShowPass, setForgotShowPass] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState<string | null>(null)
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null)
  const [maskedContactInfo, setMaskedContactInfo] = useState<string | null>(null)

  // OTP Countdown Timer (120 seconds)
  const [otpTimeLeft, setOtpTimeLeft] = useState<number>(120)

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>
    if (activeModal === 'forgot' && forgotStep === 2 && otpTimeLeft > 0) {
      timerId = setInterval(() => {
        setOtpTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timerId) clearInterval(timerId)
    }
  }, [activeModal, forgotStep, otpTimeLeft])

  const formatOtpTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const usernameInputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '', remember: true },
  })

  const { ref: registerUsernameRef, ...usernameRegisterProps } = register('username')

  // Auto focus username on mount
  useEffect(() => {
    usernameInputRef.current?.focus()
  }, [])

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  const handleLanguageChange = async (langCode: LanguageCode) => {
    await setLanguage(langCode)
    setLangDropdownOpen(false)
  }

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    updateThemeMode(mode)
    setThemeDropdownOpen(false)
  }

  // Detect Caps Lock Keypress
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'))
    }
  }

  // Fast 1-Click Demo Account Autofill for frictionless UX testing
  const fillDemoAccount = (role: 'admin' | 'manager' | 'cashier') => {
    setServerError(null)
    if (role === 'admin') {
      setValue('username', 'admin', { shouldValidate: true })
      setValue('password', 'password', { shouldValidate: true })
    } else if (role === 'manager') {
      setValue('username', 'manager', { shouldValidate: true })
      setValue('password', 'password', { shouldValidate: true })
    } else {
      setValue('username', 'cashier', { shouldValidate: true })
      setValue('password', 'password', { shouldValidate: true })
    }
  }

  const resetForgotState = () => {
    setForgotStep(1)
    setForgotIdentifier('')
    setForgotOtpToken('')
    setForgotNewPassword('')
    setForgotLoading(false)
    setForgotError(null)
    setForgotSuccessMsg(null)
    setMaskedContactInfo(null)
    setOtpTimeLeft(120)
  }

  const handleRequestPasswordReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!forgotIdentifier.trim()) {
      setForgotError(t('auth.errors.422'))
      return
    }

    try {
      setForgotLoading(true)
      setForgotError(null)
      setForgotSuccessMsg(null)

      const res = await api.post('/auth/forgot-password', {
        identifier: forgotIdentifier.trim(),
      })

      const data = res.data.data
      setForgotOtpToken(data.reset_token || '123456')
      setMaskedContactInfo(data.masked_contact || 'registered contact')
      setForgotSuccessMsg(`Reset code verified! OTP code: ${data.reset_token}`)
      setOtpTimeLeft(120)
      setForgotStep(2)
    } catch (err: any) {
      const msg = err.response?.data?.message || t('auth.errors.404')
      setForgotError(msg)
    } finally {
      setForgotLoading(false)
    }
  }

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otpTimeLeft === 0) {
      setForgotError(t('auth.modals.otpExpiredMsg'))
      return
    }

    if (!forgotOtpToken.trim() || !forgotNewPassword.trim()) {
      setForgotError(t('auth.errors.422'))
      return
    }

    if (forgotNewPassword.length < 4) {
      setForgotError(t('auth.errors.422'))
      return
    }

    try {
      setForgotLoading(true)
      setForgotError(null)

      await api.post('/auth/reset-password', {
        identifier: forgotIdentifier.trim(),
        reset_token: forgotOtpToken.trim(),
        password: forgotNewPassword.trim(),
      })

      setForgotSuccessMsg(t('auth.loginSuccess'))
      
      setValue('username', forgotIdentifier.trim(), { shouldValidate: true })
      setValue('password', forgotNewPassword.trim(), { shouldValidate: true })

      setTimeout(() => {
        setActiveModal(null)
        resetForgotState()
      }, 1500)
    } catch (err: any) {
      const msg = err.response?.data?.message || t('auth.errors.422')
      setForgotError(msg)
    } finally {
      setForgotLoading(false)
    }
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError(null)
      setIsSuccessState(false)
      setLoginProgress(25)

      const sanitizedUsername = data.username.trim()
      setLoginProgress(50)

      const res = await api.post('/auth/login', {
        username: sanitizedUsername,
        password: data.password,
        remember: data.remember ?? false,
      })

      setLoginProgress(85)
      const { user, access_token, token, refresh_token } = res.data.data
      const effectiveToken = access_token || token

      setLoginProgress(100)
      setIsSuccessState(true)

      setAuth(user, effectiveToken, refresh_token)

      setTimeout(() => {
        navigate('/dashboard')
      }, 600)
    } catch (err: any) {
      setLoginProgress(0)
      setIsSuccessState(false)

      const status = err.response?.status
      const backendMsg = err.response?.data?.message

      let errorTitle = t('auth.errorTitles.authFailed', 'មិនអាចចូលប្រព័ន្ធបានទេ')
      let errorMessage = t('auth.errors.unknown', 'មានកំហុសមិនរំពឹងទុកបានកើតឡើង។ សូមព្យាយាមម្តងទៀត។')

      if (!err.response) {
        if (!navigator.onLine) {
          errorTitle = t('auth.errorTitles.network', 'បញ្ហាការតភ្ជាប់បណ្តាញ')
          errorMessage = t('auth.errors.offline')
        } else if (err.code === 'ECONNABORTED') {
          errorTitle = t('auth.errorTitles.network', 'បញ្ហាការតភ្ជាប់បណ្តាញ')
          errorMessage = t('auth.errors.timeout')
        } else {
          errorTitle = t('auth.errorTitles.network', 'បញ្ហាការតភ្ជាប់បណ្តាញ')
          errorMessage = t('auth.errors.networkError')
        }
      } else if (status === 401) {
        errorTitle = t('auth.errorTitles.authFailed', 'មិនអាចចូលប្រព័ន្ធបានទេ')
        errorMessage = t('auth.errors.401')
      } else if (status === 403) {
        errorTitle = t('auth.errorTitles.accessDenied', 'គណនីគ្មានសិទ្ធិ ឬត្រូវបានផ្អាក')
        errorMessage = t('auth.errors.403')
      } else if (status === 404) {
        errorTitle = t('auth.errorTitles.notFound', 'រកមិនឃើញគណនី')
        errorMessage = t('auth.errors.404')
      } else if (status === 419) {
        errorTitle = t('auth.errorTitles.sessionExpired', 'សេសសិនផុតកំណត់')
        errorMessage = t('auth.errors.419')
      } else if (status === 422) {
        errorTitle = t('auth.errorTitles.authFailed', 'ព័ត៌មានមិនត្រឹមត្រូវ')
        errorMessage = t('auth.errors.422')
      } else if (status === 429) {
        errorTitle = t('auth.errorTitles.locked', 'គណនីត្រូវបានសោរបណ្តោះអាសន្ន')
        errorMessage = t('auth.errors.429')
      } else if (status === 500) {
        errorTitle = t('auth.errorTitles.serverError', 'ប្រព័ន្ធកំពុងជួបបញ្ហា')
        errorMessage = t('auth.errors.500')
      } else if (status === 503) {
        errorTitle = t('auth.errorTitles.maintenance', 'ម៉ាស៊ីនបម្រើកំពុងថែទាំ')
        errorMessage = t('auth.errors.503')
      } else if (backendMsg) {
        errorMessage = backendMsg
      }

      setServerError({
        code: status,
        title: errorTitle,
        message: errorMessage,
      })
    }
  }

  const companyDisplayName = branding.brand_name || branding.company_name || 'OptaPOS'

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-x-hidden font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      
      {/* ─── Ambient Glow & Subtle Grid Background ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* ─── TOP NAVIGATION / CLEAN HEADER ──────────────────────────────────── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 min-w-0">
          <BrandLogo size="sm" rounded="xl" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white truncate">
              {companyDisplayName}
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              Enterprise
            </span>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Support Button */}
          <button
            onClick={() => setActiveModal('support')}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t('auth.helpSupport', 'ជំនួយ & ការគាំទ្រ')}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen)
                setThemeDropdownOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all cursor-pointer"
            >
              <CountryFlagIcon code={currentLangObj.code} />
              <span className="hidden xs:inline">{currentLangObj.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50"
                  >
                    {LANGUAGES.map((lang) => {
                      const isSel = language === lang.code
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <CountryFlagIcon code={lang.code} />
                            <span>{lang.label}</span>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </button>
                      )
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen)
                setLangDropdownOpen(false)
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs transition-all cursor-pointer"
              title="Theme Toggle"
            >
              {themeMode === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : themeMode === 'dark' ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Monitor className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <AnimatePresence>
              {themeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setThemeDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-40 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50"
                  >
                    {[
                      { id: 'light', label: t('auth.theme.light', 'Light Mode'), icon: <Sun className="w-4 h-4 text-amber-500" /> },
                      { id: 'dark', label: t('auth.theme.dark', 'Dark Mode'), icon: <Moon className="w-4 h-4 text-blue-400" /> },
                      { id: 'system', label: t('auth.theme.system', 'System Default'), icon: <Monitor className="w-4 h-4 text-slate-400" /> },
                    ].map((mode) => {
                      const isSel = themeMode === mode.id
                      return (
                        <button
                          key={mode.id}
                          onClick={() => handleThemeChange(mode.id as any)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {mode.icon}
                            <span>{mode.label}</span>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </button>
                      )
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ─── MAIN RESPONSIVE CLEAN SPLIT LAYOUT ─────────────────────────────── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center my-auto">

          {/* ─── LEFT HERO VALUE SECTION (Desktop) ─────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center py-4 pr-0 xl:pr-4 text-left">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6 max-w-xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{language === 'km' ? `ប្រព័ន្ធ ${companyDisplayName} Enterprise ជំនាន់ថ្មី` : `${companyDisplayName} Enterprise Omnichannel`}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {language === 'km' ? (
                  <>
                    ប្រព័ន្ធគ្រប់គ្រង <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{companyDisplayName}</span> លំដាប់សហគ្រាស
                  </>
                ) : (
                  <>
                    Next-Gen <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{companyDisplayName}</span> Commerce & POS
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                {language === 'km' 
                  ? (branding.brand_tagline_km || 'ភ្ជាប់ការលក់នៅបញ្ជរផ្ទាល់ (POS), ការបញ្ជាទិញអនឡាញ, និងការគ្រប់គ្រងស្តុកច្រើនឃ្លាំងក្នុងប្រព័ន្ធតែមួយ។')
                  : (branding.brand_tagline || 'Unified Point of Sale, Multi-Warehouse Inventory, and Real-Time Financial Ledger in one seamless platform.')}
              </p>

              {/* 3 Core Value Props */}
              <div className="space-y-3 pt-2">
                {[
                  { title: language === 'km' ? 'លក់រហ័សទាន់ចិត្ត (High-Speed POS)' : 'High-Speed POS & Barcode', desc: language === 'km' ? 'គាំទ្រ KHQR, Split Payment និងបោះពុម្ពវិក្កយបត្រភ្លាមៗ' : 'Instant KHQR, Split Payments, and thermal receipt printing' },
                  { title: language === 'km' ? 'គ្រប់គ្រងស្តុកច្រើនសាខា (Multi-Branch Inventory)' : 'Multi-Branch Inventory', desc: language === 'km' ? 'កាត់ស្តុក Real-time ផ្ទេរទំនិញរវាងឃ្លាំង និងតាមដានចលនាស្តុក' : 'Real-time atomic stock deduction, transfers, and ledger audit' },
                  { title: language === 'km' ? 'សុវត្ថិភាពខ្ពស់ & សិទ្ធិបុគ្គលិក (RBAC Security)' : 'Role-Based Access & Audit', desc: language === 'km' ? 'កំណត់សិទ្ធិតាមតួនាទី និងតាមដានប្រវត្តិសកម្មភាព Activity Log' : 'Granular permission controls, shift tracking, and activity audit' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Metric Cards */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('auth.cards.sales', 'ការលក់សរុប')}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">$128,450.00</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('auth.cards.inventory', 'មុខទំនិញក្នុងស្តុក')}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">14,250 Items</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT LOGIN CARD (Ultra Clean Standard Form UX) ─────────────── */}
          <div className="w-full lg:col-span-6 xl:col-span-5 flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-[420px] sm:max-w-[440px] mx-auto lg:mr-0"
            >
              {/* Clean Standard Card Container */}
              <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 overflow-hidden">
                
                {/* Progress Bar during loading */}
                {isSubmitting && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden z-20">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: '0%' }}
                      animate={{ width: `${loginProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {/* Header inside Login Card */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <BrandLogo size="lg" rounded="2xl" className="mb-3.5" />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t('auth.loginTitle', 'ស្វាគមន៍ការត្រឡប់មកវិញ')}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                    {t('auth.loginSubtitle', 'សូមបញ្ចូលព័ត៌មានគណនីដើម្បីចូលប្រព័ន្ធ')}
                  </p>
                </div>

                {/* Modern Error Alert Box */}
                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -6 }}
                      className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 shadow-xs"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-rose-900 dark:text-rose-100">{serverError.title}</div>
                        <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">{serverError.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setServerError(null)}
                        className="text-rose-400 hover:text-rose-700 p-0.5 rounded cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ─── ULTRA CLEAN LOGIN FORM ──────────────────────────────── */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-4.5" onKeyDown={handleKeyDown}>
                  
                  {/* Identifier Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('auth.identifierLabel', 'ឈ្មោះគណនី / លេខកូដបុគ្គលិក / លេខទូរស័ព្ទ')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <input
                        {...usernameRegisterProps}
                        ref={(e) => {
                          registerUsernameRef(e)
                          usernameInputRef.current = e
                        }}
                        type="text"
                        autoComplete="username"
                        placeholder={t('auth.identifierPlaceholder', 'ឧ. admin, EMP-0001, ឬ 012345678')}
                        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/60 border rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm
                                   placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all ${
                                     errors.username
                                       ? 'border-rose-400 bg-rose-50/20'
                                       : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                                   }`}
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>{errors.username.message === 'identifierRequired' ? 'សូមបញ្ចូលឈ្មោះគណនី' : errors.username.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t('auth.password', 'ពាក្យសម្ងាត់')}
                      </label>

                      {/* Caps Lock Indicator */}
                      {capsLockActive && (
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          {t('auth.capsLockOn', 'Caps Lock កំពុងបើក')}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder={t('auth.passwordPlaceholder', '••••••••')}
                        className={`w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/60 border rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm
                                   placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all ${
                                     errors.password
                                       ? 'border-rose-400 bg-rose-50/20'
                                       : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                                   }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>{errors.password.message === 'passwordRequired' ? 'សូមបញ្ចូលពាក្យសម្ងាត់' : errors.password.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <input
                        {...register('remember')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                        {t('auth.rememberMe', 'ចងចាំគណនីនេះ')}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        resetForgotState()
                        setActiveModal('forgot')
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {t('auth.forgotPassword', 'ភ្លេចពាក្យសម្ងាត់?')}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccessState}
                    className={`w-full py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all duration-200
                              flex items-center justify-center gap-2 cursor-pointer ${
                                isSuccessState
                                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/20'
                              } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isSuccessState ? (
                      <div className="flex items-center gap-2 text-white font-bold">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>{t('auth.loginSuccess', 'ចូលប្រព័ន្ធជោគជ័យ!')}</span>
                      </div>
                    ) : isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{t('auth.loggingIn', 'កំពុងផ្ទៀងផ្ទាត់...')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-bold">
                        <LogIn className="w-4 h-4" />
                        <span>{t('auth.loginButton', 'ចូលប្រព័ន្ធ')}</span>
                      </div>
                    )}
                  </button>
                </form>

                {/* ─── QUICK DEMO ACCOUNTS PILLS (1-Click Auto Fill UX) ─────── */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-center mb-2.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      {language === 'km' ? '— សាកល្បង Demo Accounts រហ័ស —' : '— Quick Demo Access —'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('admin')}
                      className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer truncate"
                      title="Super Admin"
                    >
                      👑 Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('manager')}
                      className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer truncate"
                      title="Branch Manager"
                    >
                      👔 Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('cashier')}
                      className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer truncate"
                      title="Cashier Terminal"
                    >
                      💳 Cashier
                    </button>
                  </div>
                </div>

                {/* ─── Trust & Security Badge ─────────────────────────────── */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{t('auth.securityNote', 'សុវត្ថិភាពកម្រិតខ្ពស់ Enterprise • ការការពារទិន្នន័យ SSL 256-bit')}</span>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/60 dark:border-slate-900 text-xs text-slate-500 text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} {companyDisplayName}. {language === 'km' ? 'រក្សាសិទ្ធិគ្រប់យ៉ាង។' : 'All rights reserved.'}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            {t('auth.privacyPolicy', 'គោលការណ៍ឯកជនភាព')}
          </button>
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            {t('auth.termsOfService', 'លក្ខខណ្ឌប្រើប្រាស់')}
          </button>
          <button
            onClick={() => setActiveModal('support')}
            className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            {t('auth.helpSupport', 'ជំនួយ & គាំទ្រ')}
          </button>
        </div>
      </footer>

      {/* ─── INTERACTIVE MODALS (FORGOT PASSWORD, SUPPORT, TERMS, PRIVACY) ─── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveModal(null)
                resetForgotState()
              }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveModal(null)
                  resetForgotState()
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Forgot Password Modal */}
              {activeModal === 'forgot' && (
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('auth.modals.forgotTitle', 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                    {forgotStep === 1
                      ? t('auth.modals.forgotDesc', 'សូមបញ្ចូលឈ្មោះគណនី ឬលេខទូរស័ព្ទរបស់អ្នកដើម្បីទទួលលេខកូដផ្ទៀងផ្ទាត់ OTP។')
                      : t('auth.modals.otpDesc', 'សូមបញ្ចូលលេខកូដ OTP និងពាក្យសម្ងាត់ថ្មីរបស់អ្នក។')}
                  </p>

                  {forgotError && (
                    <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                      {forgotError}
                    </div>
                  )}

                  {forgotSuccessMsg && (
                    <div className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs">
                      {forgotSuccessMsg}
                    </div>
                  )}

                  {forgotStep === 1 ? (
                    <form onSubmit={handleRequestPasswordReset} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t('auth.identifierLabel', 'ឈ្មោះគណនី ឬ លេខទូរស័ព្ទ')}
                        </label>
                        <input
                          type="text"
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          placeholder="ឧ. admin ឬ 012345678"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{t('auth.modals.sendResetCode', 'ផ្ញើលេខកូដ OTP')}</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmPasswordReset} className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {t('auth.modals.otpLabel', 'លេខកូដ OTP')}
                          </label>
                          <span className={`text-[11px] font-bold ${otpTimeLeft < 30 ? 'text-rose-500' : 'text-blue-600 dark:text-blue-400'}`}>
                            ⏱ {formatOtpTimer(otpTimeLeft)}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={forgotOtpToken}
                          onChange={(e) => setForgotOtpToken(e.target.value)}
                          placeholder="ឧ. 123456"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t('auth.modals.newPassword', 'ពាក្យសម្ងាត់ថ្មី')}
                        </label>
                        <div className="relative">
                          <input
                            type={forgotShowPass ? 'text' : 'password'}
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            placeholder="យ៉ាងហោចណាស់ ៤ តួអក្សរ"
                            className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setForgotShowPass(!forgotShowPass)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                          >
                            {forgotShowPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={forgotLoading || otpTimeLeft === 0}
                        className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{t('auth.modals.confirmReset', 'ផ្លាស់ប្តូរពាក្យសម្ងាត់')}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Support Modal */}
              {activeModal === 'support' && (
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('auth.modals.supportTitle', 'ជំនួយ និងសេវាបម្រើអតិថិជន')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                    {t('auth.modals.supportDesc', 'ប្រសិនបើអ្នកជួបបញ្ហាក្នុងការចូលប្រព័ន្ធ សូមទាក់ទងមកកាន់ផ្នែកបច្ចេកវិទ្យារបស់យើង។')}
                  </p>

                  <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-semibold">{branding.email || 'support@optapos.io'}</div>
                        <div className="text-[11px] text-slate-400">ផ្ញើអ៊ីមែលមកកាន់យើង ២៤/៧</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                      <Headphones className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-semibold">{branding.phone || '+855 23 888 999'}</div>
                        <div className="text-[11px] text-slate-400">ទូរស័ព្ទ hotline ជំនួយរហ័ស</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Modal */}
              {activeModal === 'terms' && (
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('auth.modals.termsTitle', 'លក្ខខណ្ឌប្រើប្រាស់')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    {t('auth.modals.termsDesc', 'ប្រព័ន្ធនេះត្រូវបានការពារដោយច្បាប់កម្មសិទ្ធិបញ្ញា។ ការចូលប្រើប្រាស់ដោយគ្មានការអនុញ្ញាត នឹងត្រូវប្រឈមមុខនឹងវិធានការច្បាប់។')}
                  </p>
                </div>
              )}

              {/* Privacy Modal */}
              {activeModal === 'privacy' && (
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('auth.modals.privacyTitle', 'គោលការណ៍ឯកជនភាព')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    {t('auth.modals.privacyDesc', 'រាល់ទិន្នន័យការលក់ និងព័ត៌មានសម្ងាត់របស់អ្នកត្រូវបានការពារដោយបច្ចេកវិទ្យា Encryption កម្រិតស្តង់ដារអន្តរជាតិ។')}
                  </p>
                </div>
              )}

              {/* Close Button at bottom of modal */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    setActiveModal(null)
                    resetForgotState()
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {t('auth.close', 'បិទ')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LoginPage
