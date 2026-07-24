export type NotificationType =
  | 'system'
  | 'inventory'
  | 'purchase'
  | 'sales'
  | 'customer'
  | 'supplier'
  | 'employee'
  | 'attendance'
  | 'payroll'
  | 'finance'
  | 'expense'
  | 'payment'
  | 'security'
  | 'report'
  | 'marketing'
  | 'shipping'
  | 'company'
  | 'setting'
  | 'warning'
  | 'success'
  | 'error'

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical'

export type DeliveryChannel =
  | 'database'
  | 'email'
  | 'telegram'
  | 'sms'
  | 'push'
  | 'websocket'
  | 'slack'
  | 'teams'
  | 'discord'

export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'cancelled'

export interface NotificationItem {
  id: number
  company_id?: number | null
  company_name?: string | null
  branch_id?: number | null
  branch_name?: string | null
  type: NotificationType
  title: string
  message: string
  icon?: string | null
  color?: string | null
  priority: NotificationPriority
  image?: string | null
  action_url?: string | null
  reference_type?: string | null
  reference_id?: string | null
  created_by?: number | null
  creator_name?: string | null
  expires_at?: string | null
  is_global: boolean
  status: NotificationStatus
  is_read: boolean
  read_at?: string | null
  is_archived: boolean
  read_count?: number
  created_at: string
  updated_at: string
}

export interface NotificationTemplateItem {
  id: number
  code: string
  name: string
  title_template: string
  message_template: string
  icon?: string | null
  color?: string | null
  type: NotificationType
  priority: NotificationPriority
  is_active: boolean
  action_url?: string | null
  image_url?: string | null
  created_at: string
  updated_at: string
}

export interface NotificationLogItem {
  id: number
  notification_id: number
  user_id?: number | null
  user_name?: string | null
  channel: DeliveryChannel
  status: NotificationStatus
  response?: string | null
  sent_at?: string | null
  created_at: string
}

export interface ChannelCredentials {
  webhook_url?: string
  api_key?: string
  bot_token?: string
  chat_id?: string
  smtp_host?: string
  smtp_port?: number
  smtp_user?: string
  smtp_pass?: string
  sender_phone?: string
}

export interface NotificationSettings {
  email_notify: boolean
  telegram_notify: boolean
  sms_notify: boolean
  push_notify: boolean
  browser_notify: boolean
  sound_notify: boolean
  desktop_notify?: boolean
  websocket_notify?: boolean
  slack_notify?: boolean
  teams_notify?: boolean
  discord_notify?: boolean
  default_priority?: string
  retention_days?: number
  archive_after_days?: number
  max_storage_mb?: number
  smtp_status?: string
  sender_name?: string
  sender_email?: string
  telegram_status?: string
  sms_status?: string
  push_status?: string
  websocket_status?: string
  slack_status?: string
  teams_status?: string
  discord_status?: string
  jwt_validation?: boolean
  permission_check?: boolean
  role_check?: boolean
  company_isolation?: boolean
  branch_isolation?: boolean
  position?: 'top_right' | 'bottom_right' | 'bottom_left' | 'top_left'
  animation?: 'slide' | 'fade' | 'scale' | 'bounce'
  duration_seconds?: number
  theme?: 'glass' | 'dark' | 'light'
  sound_volume?: number
  sound_name?: 'chime' | 'bell' | 'pulse' | 'crystal' | 'subtle'
  auto_refresh_sec?: number
  channels_config?: Record<string, ChannelCredentials>
}

export interface NotificationFilters {
  search?: string
  type?: string
  priority?: string
  status?: string
  tab?: 'all' | 'unread' | 'read' | 'archived' | string
  start_date?: string
  end_date?: string
  company_id?: number
  branch_id?: number
  created_by?: number
  is_global?: boolean
  page?: number
  per_page?: number
}

export interface NotificationStats {
  summary: {
    total: number
    unread: number
    read: number
    critical: number
    system: number
    inventory: number
    sales: number
    purchase: number
    finance: number
    employee: number
    security: number
    today: number
  }
  charts: {
    by_type: Record<string, number>
    by_priority: Record<string, number>
    daily_trend: { date: string; count: number }[]
    read_ratio: { read: number; unread: number }
  }
}

export interface NotificationLogsResponse {
  logs: NotificationLogItem[]
  read_users: {
    user_id: number
    name: string
    email?: string | null
    is_read: boolean
    read_at?: string | null
  }[]
  recipient_count: number
  read_count: number
}
