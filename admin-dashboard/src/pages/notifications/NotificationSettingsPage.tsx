import React, { useState, useEffect } from 'react'
import {
  Settings, Bell, Mail, Send, Smartphone, Volume2, Globe, Shield, Save, Check,
  Zap, Lock, Radio, Server, CheckCircle2, AlertTriangle, RefreshCw, Database,
  Hash, MessageSquare, Play, RotateCcw, Sliders, Eye, Layers, TrendingUp, Cpu,
  Star, Plus, X, ShieldAlert, ShoppingCart, DollarSign, SlidersHorizontal, Sliders as SlidersIcon
} from 'lucide-react'
import { Switch, Button, Card, Input, InputNumber, Select, Slider, Tag, Divider, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import notificationService from '@/services/notificationService'
import type { NotificationSettings, ChannelCredentials } from '@/types/notification'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Breadcrumb from '@/components/common/Breadcrumb'
import ChannelConfigModal from './components/ChannelConfigModal'

const NotificationSettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('general')
  const [testingChannel, setTestingChannel] = useState<string | null>(null)

  // Channel Config Modal State
  const [configModalChannel, setConfigModalChannel] = useState<string | null>(null)

  // Test Notification Form State
  const [testChannelSelect, setTestChannelSelect] = useState<string>('email')
  const [testTitleInput, setTestTitleInput] = useState<string>('Enterprise System Diagnostic Ping')
  const [testMessageInput, setTestMessageInput] = useState<string>('This is a live test notification generated from the Enterprise POS settings panel.')

  const [settings, setSettings] = useState<NotificationSettings>({
    email_notify: true,
    telegram_notify: true,
    sms_notify: false,
    push_notify: true,
    browser_notify: true,
    sound_notify: true,
    desktop_notify: true,
    websocket_notify: true,
    slack_notify: false,
    teams_notify: false,
    discord_notify: false,
    default_priority: 'normal',
    retention_days: 60,
    archive_after_days: 30,
    max_storage_mb: 5000,
    smtp_status: 'connected',
    sender_name: 'Enterprise POS System',
    sender_email: 'notifications@enterprisepos.com',
    telegram_status: 'connected',
    sms_status: 'active',
    push_status: 'active',
    websocket_status: 'connected',
    slack_status: 'config_required',
    teams_status: 'config_required',
    discord_status: 'config_required',
    jwt_validation: true,
    permission_check: true,
    role_check: true,
    company_isolation: true,
    branch_isolation: true,
    position: 'top_right',
    animation: 'slide',
    duration_seconds: 5,
    theme: 'glass',
    sound_volume: 80,
    sound_name: 'chime',
    auto_refresh_sec: 30,
    channels_config: {},
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const data = await notificationService.getSettings()
      setSettings((prev) => ({ ...prev, ...data }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (key: keyof NotificationSettings, val: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await notificationService.updateSettings(settings)
      sound.playSuccess()
      toast.success('Notification settings saved successfully!')
    } catch (e) {
      sound.playError()
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = () => {
    setSettings({
      email_notify: true,
      telegram_notify: true,
      sms_notify: false,
      push_notify: true,
      browser_notify: true,
      sound_notify: true,
      desktop_notify: true,
      websocket_notify: true,
      slack_notify: false,
      teams_notify: false,
      discord_notify: false,
      default_priority: 'normal',
      retention_days: 60,
      archive_after_days: 30,
      max_storage_mb: 5000,
      jwt_validation: true,
      permission_check: true,
      role_check: true,
      company_isolation: true,
      branch_isolation: true,
      position: 'top_right',
      animation: 'slide',
      duration_seconds: 5,
      theme: 'glass',
      sound_volume: 80,
      sound_name: 'chime',
      auto_refresh_sec: 30,
    })
    toast.info('Reset to default enterprise settings')
  }

  const handleTestChannel = async (ch: string) => {
    if (ch === 'sound') {
      sound.play()
      toast.success('Sound chime test played!')
      return
    }

    setTestingChannel(ch)
    try {
      if (ch === 'email') await notificationService.testEmail()
      else if (ch === 'telegram') await notificationService.testTelegram()
      else if (ch === 'sms') await notificationService.testSms()
      else if (ch === 'push') await notificationService.testPush()
      else await notificationService.testChannel(ch)
      sound.playSuccess()
      toast.success(`Test ping for channel [${ch.toUpperCase()}] sent successfully!`)
    } catch (e) {
      sound.playError()
      toast.error(`Failed to send test ping for ${ch}`)
    } finally {
      setTestingChannel(null)
    }
  }

  const handleSaveChannelConfig = (ch: string, creds: ChannelCredentials) => {
    setSettings((prev) => ({
      ...prev,
      channels_config: {
        ...(prev.channels_config || {}),
        [ch]: creds,
      },
      [`${ch}_status`]: 'connected',
    }))
    toast.success(`Gateway configuration saved for ${ch.toUpperCase()}`)
  }

  const settingCategories = [
    { key: 'general', label: 'General & Sound', icon: SlidersIcon },
    { key: 'channels', label: 'Delivery Channels', icon: Send },
    { key: 'security', label: 'Security & Scope', icon: Shield },
    { key: 'retention', label: 'Data Retention', icon: Database },
    { key: 'test', label: 'Test & Diagnostic', icon: Zap },
  ]

  const channelsList = [
    { key: 'email', title: 'Email Gateway (SMTP)', desc: 'Send automated transactional HTML emails', icon: Mail, statusKey: 'smtp_status', enabledKey: 'email_notify' },
    { key: 'telegram', title: 'Telegram Bot Gateway', desc: 'Instant bot alert messages to staff chat groups', icon: Send, statusKey: 'telegram_status', enabledKey: 'telegram_notify' },
    { key: 'sms', title: 'SMS Gateway (Twilio/PlasGate)', desc: 'Mobile cellular SMS notifications for emergency alerts', icon: Smartphone, statusKey: 'sms_status', enabledKey: 'sms_notify' },
    { key: 'push', title: 'Browser Web Push (FCM)', desc: 'Realtime desktop push notifications when tab is open', icon: Radio, statusKey: 'push_status', enabledKey: 'push_notify' },
    { key: 'websocket', title: 'Realtime WebSocket (Pusher)', desc: 'Low-latency live event socket connection', icon: Zap, statusKey: 'websocket_status', enabledKey: 'websocket_notify' },
    { key: 'slack', title: 'Slack Webhook', desc: 'Dispatch notifications to Slack workspace channels', icon: MessageSquare, statusKey: 'slack_status', enabledKey: 'slack_notify' },
    { key: 'teams', title: 'Microsoft Teams Bot', desc: 'Enterprise Teams webhooks & workflow triggers', icon: Server, statusKey: 'teams_status', enabledKey: 'teams_notify' },
    { key: 'discord', title: 'Discord Webhook', desc: 'Ops & Dev community channel alert broadcasts', icon: Globe, statusKey: 'discord_status', enabledKey: 'discord_notify' },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Notification Settings' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 rounded-[24px] p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">Notification System Settings</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Configure delivery channels, audio chimes, retention policy, and security isolation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Categories + Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Category Sidebar Navigation */}
        <div className="space-y-1">
          {settingCategories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-sm scale-102 font-bold'
                    : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </div>
                {isActive && <Check className="w-4 h-4" />}
              </button>
            )
          })}
        </div>

        {/* Content Panels */}
        <div className="md:col-span-3 space-y-6">
          {/* PANEL 1: GENERAL & SOUND */}
          {activeCategory === 'general' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="bg-card border border-border/80 rounded-[24px] p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <SlidersIcon className="w-4 h-4 text-primary" /> Audio & In-App Notification Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <div>
                      <span className="font-bold text-xs text-foreground block">Audio Sound Chimes</span>
                      <span className="text-[11px] text-muted-foreground">Play audio chime when new alert arrives</span>
                    </div>
                    <Switch
                      checked={settings.sound_notify}
                      onChange={(v) => handleToggle('sound_notify', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <div>
                      <span className="font-bold text-xs text-foreground block">Desktop Browser Popups</span>
                      <span className="text-[11px] text-muted-foreground">Native OS browser notification popups</span>
                    </div>
                    <Switch
                      checked={settings.browser_notify}
                      onChange={(v) => handleToggle('browser_notify', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <div>
                      <span className="font-bold text-xs text-foreground block">Auto Feed Refresh</span>
                      <span className="text-[11px] text-muted-foreground">Automatically poll feed every 30s</span>
                    </div>
                    <Switch
                      checked={settings.auto_refresh_sec ? true : false}
                      onChange={(v) => handleToggle('auto_refresh_sec' as any, v ? 30 : 0)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <div>
                      <span className="font-bold text-xs text-foreground block">Audio Test Sound</span>
                      <span className="text-[11px] text-muted-foreground">Click to test audio speaker sound</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTestChannel('sound')}
                      className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> Test Chime
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PANEL 2: DELIVERY CHANNELS */}
          {activeCategory === 'channels' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {channelsList.map((ch) => {
                  const Icon = ch.icon
                  const isEnabled = Boolean((settings as any)[ch.enabledKey])
                  const status = (settings as any)[ch.statusKey] || 'connected'

                  return (
                    <div
                      key={ch.key}
                      className="bg-card border border-border/80 rounded-[24px] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-foreground">{ch.title}</h4>
                            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${
                              status === 'connected' || status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            }`}>
                              {status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{ch.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => setConfigModalChannel(ch.key)}
                          className="px-3 py-1.5 text-xs font-semibold border border-border rounded-xl hover:bg-muted text-foreground transition-colors cursor-pointer"
                        >
                          Configure API
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTestChannel(ch.key)}
                          disabled={testingChannel === ch.key}
                          className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary hover:text-white transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        >
                          {testingChannel === ch.key ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                          <span>Test</span>
                        </button>
                        <Switch
                          checked={isEnabled}
                          onChange={(v) => handleToggle(ch.enabledKey as any, v)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* PANEL 3: SECURITY & SCOPE */}
          {activeCategory === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="bg-card border border-border/80 rounded-[24px] p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-emerald-500" /> Multi-Tenant Security & Permission Isolation
                </h3>

                <div className="space-y-3 pt-2">
                  {[
                    { key: 'company_isolation', title: 'Company Multi-Tenant Isolation', desc: 'Strictly isolate alert feeds between separate parent enterprise companies' },
                    { key: 'branch_isolation', title: 'Branch Scope Protection', desc: 'Restrict warehouse and branch inventory alerts to assigned branch staff' },
                    { key: 'role_check', title: 'RBAC Role Enforcement', desc: 'Filter financial alerts to Finance Managers and Super Admins only' },
                    { key: 'jwt_validation', title: 'JWT Token Sanctum Signature', desc: 'Verify API token signatures for WebSocket realtime alert sockets' },
                  ].map((sec) => (
                    <div key={sec.key} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                      <div>
                        <span className="font-bold text-xs text-foreground block">{sec.title}</span>
                        <span className="text-[11px] text-muted-foreground">{sec.desc}</span>
                      </div>
                      <Switch
                        checked={Boolean((settings as any)[sec.key])}
                        onChange={(v) => handleToggle(sec.key as any, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PANEL 4: RETENTION POLICY */}
          {activeCategory === 'retention' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="bg-card border border-border/80 rounded-[24px] p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <Database className="w-4 h-4 text-purple-500" /> Automated Cleanup & Database Retention
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                    <label className="text-xs font-bold text-foreground block">Auto-Archive After (Days)</label>
                    <InputNumber
                      min={7}
                      max={365}
                      value={settings.archive_after_days}
                      onChange={(val) => setSettings((p) => ({ ...p, archive_after_days: Number(val) || 30 }))}
                      className="w-full text-xs rounded-xl"
                    />
                    <span className="text-[10px] text-muted-foreground block">Read notifications older than this will move to archive</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                    <label className="text-xs font-bold text-foreground block">Permanent Purge Retention (Days)</label>
                    <InputNumber
                      min={30}
                      max={730}
                      value={settings.retention_days}
                      onChange={(val) => setSettings((p) => ({ ...p, retention_days: Number(val) || 60 }))}
                      className="w-full text-xs rounded-xl"
                    />
                    <span className="text-[10px] text-muted-foreground block">Soft-deleted notifications purged from DB after retention window</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PANEL 5: TEST DIAGNOSTIC PING */}
          {activeCategory === 'test' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="bg-card border border-border/80 rounded-[24px] p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-500" /> Send Live Diagnostic Test Broadcast
                </h3>
                <p className="text-xs text-muted-foreground">Trigger a real-time test notification to verify delivery gateways and sound chimes.</p>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Target Channel</label>
                    <Select
                      value={testChannelSelect}
                      onChange={setTestChannelSelect}
                      className="w-full text-xs"
                      options={[
                        { value: 'email', label: 'Email Gateway (SMTP)' },
                        { value: 'telegram', label: 'Telegram Bot' },
                        { value: 'sms', label: 'Cellular SMS' },
                        { value: 'push', label: 'Web Push' },
                        { value: 'sound', label: 'Audio Chime Only' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Test Title</label>
                    <Input
                      value={testTitleInput}
                      onChange={(e) => setTestTitleInput(e.target.value)}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Test Message Body</label>
                    <Input.TextArea
                      rows={3}
                      value={testMessageInput}
                      onChange={(e) => setTestMessageInput(e.target.value)}
                      className="text-xs rounded-xl font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestChannel(testChannelSelect)}
                    disabled={testingChannel !== null}
                    className="w-full py-2.5 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {testingChannel ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Dispatch Diagnostic Test Notification</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Gateway Config Modal */}
      <ChannelConfigModal
        open={configModalChannel !== null}
        channel={configModalChannel}
        initialConfig={(settings.channels_config as any)?.[configModalChannel || ''] || {}}
        onClose={() => setConfigModalChannel(null)}
        onSave={handleSaveChannelConfig}
      />
    </div>
  )
}

export default NotificationSettingsPage
