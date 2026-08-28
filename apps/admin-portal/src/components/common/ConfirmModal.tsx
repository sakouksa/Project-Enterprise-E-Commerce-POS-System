import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  LogOut,
  ShieldAlert,
  RotateCcw,
  Archive,
  X,
  Loader2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import { translateString } from '@/lib/i18n'

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success'
export type ConfirmActionType =
  | 'delete'
  | 'logout'
  | 'revoke'
  | 'warning'
  | 'restore'
  | 'archive'
  | 'info'
  | 'success'

export interface ConfirmModalProps {
  isOpen: boolean
  variant?: ConfirmVariant
  actionType?: ConfirmActionType
  title?: string
  subtitle?: string
  message?: React.ReactNode
  itemName?: string
  warningText?: string
  confirmText?: string
  cancelText?: string
  isPending?: boolean
  loading?: boolean
  icon?: React.ComponentType<{ size?: number; className?: string }>
  onConfirm: () => void
  onCancel: () => void
}

interface ActionConfig {
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconColor: string
  badgeBg: string
  button: string
}

const getActionConfig = (actionType: ConfirmActionType, variant: ConfirmVariant): ActionConfig => {
  switch (actionType) {
    case 'logout':
      return {
        icon: LogOut,
        iconColor: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400',
        button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-600/20 focus:ring-rose-500/30',
      }
    case 'revoke':
      return {
        icon: ShieldAlert,
        iconColor: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400',
        button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-600/20 focus:ring-rose-500/30',
      }
    case 'delete':
      return {
        icon: Trash2,
        iconColor: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400',
        button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-600/20 focus:ring-rose-500/30',
      }
    case 'restore':
      return {
        icon: RotateCcw,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400',
        button: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/20 focus:ring-emerald-500/30',
      }
    case 'archive':
      return {
        icon: Archive,
        iconColor: 'text-purple-600 dark:text-purple-400',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-900/40 text-purple-600 dark:text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-sm shadow-purple-600/20 focus:ring-purple-500/30',
      }
    case 'warning':
      return {
        icon: AlertTriangle,
        iconColor: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400',
        button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-sm shadow-amber-600/20 focus:ring-amber-500/30',
      }
    case 'success':
      return {
        icon: CheckCircle2,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400',
        button: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/20 focus:ring-emerald-500/30',
      }
    case 'info':
    default:
      if (variant === 'danger') {
        return {
          icon: Trash2,
          iconColor: 'text-rose-600 dark:text-rose-400',
          badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400',
          button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-600/20 focus:ring-rose-500/30',
        }
      }
      if (variant === 'warning') {
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400',
          button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-sm shadow-amber-600/20 focus:ring-amber-500/30',
        }
      }
      if (variant === 'success') {
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400',
          button: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/20 focus:ring-emerald-500/30',
        }
      }
      return {
        icon: Info,
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400',
        button: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-600/20 focus:ring-indigo-500/30',
      }
  }
}

const resolveActionType = (
  explicitActionType?: ConfirmActionType,
  variant?: ConfirmVariant,
  title?: string,
  confirmText?: string
): ConfirmActionType => {
  if (explicitActionType) return explicitActionType

  const str = `${title || ''} ${confirmText || ''}`.toLowerCase()
  if (
    str.includes('logout') ||
    str.includes('sign out') ||
    str.includes('ចាកចេញ') ||
    str.includes('退出') ||
    str.includes('ออกจากระบบ') ||
    str.includes('đăng xuất')
  ) {
    return 'logout'
  }
  if (
    str.includes('revoke') ||
    str.includes('ដកហូត') ||
    str.includes('撤销') ||
    str.includes('เพิกถอน') ||
    str.includes('thu hồi')
  ) {
    return 'revoke'
  }
  if (
    str.includes('restore') ||
    str.includes('ស្តារ') ||
    str.includes('恢复') ||
    str.includes('กู้คืน') ||
    str.includes('khôi phục')
  ) {
    return 'restore'
  }
  if (
    str.includes('archive') ||
    str.includes('ប័ណ្ណសារ') ||
    str.includes('归档') ||
    str.includes('เก็บถาวร') ||
    str.includes('lưu trữ')
  ) {
    return 'archive'
  }
  if (
    variant === 'danger' ||
    str.includes('delete') ||
    str.includes('remove') ||
    str.includes('លុប') ||
    str.includes('删除') ||
    str.includes('ลบ') ||
    str.includes('xóa')
  ) {
    return 'delete'
  }
  if (variant === 'warning') return 'warning'
  if (variant === 'success') return 'success'
  return 'info'
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  variant = 'danger',
  actionType,
  title,
  subtitle,
  message,
  itemName,
  warningText,
  confirmText,
  cancelText,
  isPending = false,
  loading = false,
  icon: CustomIcon,
  onConfirm,
  onCancel,
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['common', 'products', 'buttons', 'security'])

  const isExecuting = isPending || loading
  const detectedActionType = resolveActionType(actionType, variant, title, confirmText)
  const config = getActionConfig(detectedActionType, variant)
  const VariantIcon = CustomIcon || config.icon

  // Symmetrical 5-Language Resolvers
  const getTitle = () => {
    if (title) {
      return translateString(t(title, { defaultValue: title }))
    }
    if (detectedActionType === 'logout') {
      const logoutTitles: Record<string, string> = {
        km: 'ចាកចេញពីគណនី?',
        en: 'Sign out?',
        zh: '退出登录？',
        th: 'ออกจากระบบ?',
        vi: 'Đăng xuất?',
      }
      return logoutTitles[language] || logoutTitles.en
    }
    if (detectedActionType === 'revoke') {
      const revokeTitles: Record<string, string> = {
        km: 'ដកហូតសិទ្ធិឧបករណ៍?',
        en: 'Revoke device session?',
        zh: '撤销设备会话？',
        th: 'เพิกถอนเซสชันอุปกรณ์?',
        vi: 'Thu hồi phiên thiết bị?',
      }
      return revokeTitles[language] || revokeTitles.en
    }
    if (detectedActionType === 'delete' || variant === 'danger') {
      const titles: Record<string, string> = {
        km: 'តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?',
        en: 'Delete this item?',
        zh: '确认删除？',
        th: 'ยืนยันการลบรายการนี้?',
        vi: 'Bạn có chắc chắn muốn xóa mục này?',
      }
      return titles[language] || titles.en
    }
    const titles: Record<string, string> = {
      km: 'បញ្ជាក់ប្រតិបត្តិការ',
      en: 'Confirm Action',
      zh: '确认操作',
      th: 'ยืนยันการดำเนินการ',
      vi: 'Xác nhận thao tác',
    }
    return titles[language] || titles.en
  }

  const getSubtitleContent = () => {
    if (subtitle) {
      return translateString(t(subtitle, { defaultValue: subtitle }))
    }
    if (itemName && (detectedActionType === 'delete' || variant === 'danger')) {
      const isCategoryContext =
        `${title || ''}`.toLowerCase().includes('categor') ||
        `${title || ''}`.includes('ប្រភេទ') ||
        `${title || ''}`.includes('分类') ||
        `${title || ''}`.includes('หมวดหมู่') ||
        `${title || ''}`.includes('danh mục')

      if (isCategoryContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ប្រភេទទំនិញ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The category <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                分类 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                หมวดหมู่ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Danh mục <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The category "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isBrandContext =
        `${title || ''}`.toLowerCase().includes('brand') ||
        `${title || ''}`.includes('ម៉ាក') ||
        `${title || ''}`.includes('品牌') ||
        `${title || ''}`.includes('แบรนด์') ||
        `${title || ''}`.includes('thương hiệu')

      if (isBrandContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ម៉ាកទំនិញ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The brand <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                品牌 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                แบรนด์ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Thương hiệu <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The brand "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isUnitContext =
        `${title || ''}`.toLowerCase().includes('unit') ||
        `${title || ''}`.includes('ខ្នាត') ||
        `${title || ''}`.includes('单位') ||
        `${title || ''}`.includes('หน่วย') ||
        `${title || ''}`.includes('đơn vị')

      if (isUnitContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ខ្នាតទំនិញ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The unit <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                计量单位 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                หน่วยสินค้า <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Đơn vị tính <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The unit "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isAttributeContext =
        `${title || ''}`.toLowerCase().includes('attribute') ||
        `${title || ''}`.includes('លក្ខណៈ') ||
        `${title || ''}`.includes('属性') ||
        `${title || ''}`.includes('คุณลักษณะ') ||
        `${title || ''}`.includes('thuộc tính')

      if (isAttributeContext) {
        return (
          <>
            {language === 'km' && (
              <>
                លក្ខណៈពិសេស <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The attribute <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                属性 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                คุณลักษณะ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Thuộc tính <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The attribute "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isTaxContext =
        `${title || ''}`.toLowerCase().includes('tax') ||
        `${title || ''}`.includes('ពន្ធ') ||
        `${title || ''}`.includes('税') ||
        `${title || ''}`.includes('ภาษี') ||
        `${title || ''}`.includes('thuế')

      if (isTaxContext) {
        return (
          <>
            {language === 'km' && (
              <>
                អត្រាពន្ធ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The tax rule <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                税率规则 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                อัตราภาษี <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Mức thuế <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The tax rule "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isCustomerGroupContext =
        `${title || ''}`.toLowerCase().includes('group') ||
        `${title || ''}`.includes('ក្រុម') ||
        `${title || ''}`.includes('客户组') ||
        `${title || ''}`.includes('กลุ่ม') ||
        `${title || ''}`.includes('nhóm')

      if (isCustomerGroupContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ក្រុមអតិថិជន <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The customer group <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                客户组 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                กลุ่มลูกค้า <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Nhóm khách hàng <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The customer group "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isCustomerAddressContext =
        `${title || ''}`.toLowerCase().includes('address') ||
        `${title || ''}`.includes('អាសយដ្ឋាន') ||
        `${title || ''}`.includes('地址') ||
        `${title || ''}`.includes('ที่อยู่') ||
        `${title || ''}`.includes('địa chỉ')

      if (isCustomerAddressContext) {
        return (
          <>
            {language === 'km' && (
              <>
                អាសយដ្ឋានដឹកជញ្ជូន <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The shipping address <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                配送地址 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                ที่อยู่จัดส่ง <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Địa chỉ giao hàng <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The shipping address "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isCustomerContext =
        `${title || ''}`.toLowerCase().includes('customer') ||
        `${title || ''}`.includes('អតិថិជន') ||
        `${title || ''}`.includes('客户') ||
        `${title || ''}`.includes('ลูกค้า') ||
        `${title || ''}`.includes('khách hàng')

      if (isCustomerContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ព័ត៌មានអតិថិជន <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The customer profile <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                客户资料 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                ข้อมูลลูกค้า <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Hồ sơ khách hàng <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The customer profile "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isSupplierContext =
        `${title || ''}`.toLowerCase().includes('supplier') ||
        `${title || ''}`.includes('អ្នកផ្គត់ផ្គង់') ||
        `${title || ''}`.includes('供应商') ||
        `${title || ''}`.includes('ผู้จำหน่าย') ||
        `${title || ''}`.includes('nhà cung cấp')

      if (isSupplierContext) {
        return (
          <>
            {language === 'km' && (
              <>
                អ្នកផ្គត់ផ្គង់ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                Supplier <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                供应商 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                ผู้จำหน่าย <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Nhà cung cấp <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The supplier "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isProductContext =
        `${title || ''}`.toLowerCase().includes('product') ||
        `${title || ''}`.includes('ទំនិញ') ||
        `${title || ''}`.includes('ផលិតផល') ||
        `${title || ''}`.includes('商品') ||
        `${title || ''}`.includes('สินค้า') ||
        `${title || ''}`.includes('sản phẩm')

      if (isProductContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ទំនិញ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីបញ្ជីសារពើភ័ណ្ឌ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The product <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from inventory. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                商品 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从库存中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                สินค้า <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากคลังสินค้า การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Sản phẩm <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi kho hàng. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The product <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isEmployeeContext =
        `${title || ''}`.toLowerCase().includes('employee') ||
        `${title || ''}`.includes('បុគ្គលិក') ||
        `${title || ''}`.includes('员工') ||
        `${title || ''}`.includes('พนักงาน') ||
        `${title || ''}`.includes('nhân viên')

      if (isEmployeeContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ព័ត៌មានបុគ្គលិក <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The employee profile <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                员工档案 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                ข้อมูลพนักงาน <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Hồ sơ nhân viên <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The employee profile "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isDepartmentContext =
        `${title || ''}`.toLowerCase().includes('department') ||
        `${title || ''}`.includes('ដេប៉ាតឺម៉ង់') ||
        `${title || ''}`.includes('ផ្នែក') ||
        `${title || ''}`.includes('部门') ||
        `${title || ''}`.includes('แผนก') ||
        `${title || ''}`.includes('phòng ban')

      if (isDepartmentContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ដេប៉ាតឺម៉ង់ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The department <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                部门 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                แผนก <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Phòng ban <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The department "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isPositionContext =
        `${title || ''}`.toLowerCase().includes('position') ||
        `${title || ''}`.includes('តួនាទី') ||
        `${title || ''}`.includes('职位') ||
        `${title || ''}`.includes('ตำแหน่ง') ||
        `${title || ''}`.includes('chức vụ')

      if (isPositionContext) {
        return (
          <>
            {language === 'km' && (
              <>
                តួនាទីការងារ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The position <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                职位 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                ตำแหน่ง <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Chức vụ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The position "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isAttendanceContext =
        `${title || ''}`.toLowerCase().includes('attendance') ||
        `${title || ''}`.includes('វត្តមាន') ||
        `${title || ''}`.includes('考勤') ||
        `${title || ''}`.includes('เวลาเข้า-ออกงาน') ||
        `${title || ''}`.includes('chấm công')

      if (isAttendanceContext) {
        return (
          <>
            {language === 'km' && (
              <>
                កំណត់ត្រាវត្តមាន <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The attendance record <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                考勤记录 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                บันทึกเวลาทำงาน <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Bản ghi chấm công <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The attendance record "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isPayrollContext =
        `${title || ''}`.toLowerCase().includes('payroll') ||
        `${title || ''}`.includes('ប្រាក់បៀវត្សរ៍') ||
        `${title || ''}`.includes('薪资') ||
        `${title || ''}`.includes('เงินเดือน') ||
        `${title || ''}`.includes('bảng lương')

      if (isPayrollContext) {
        return (
          <>
            {language === 'km' && (
              <>
                បញ្ជីប្រាក់បៀវត្សរ៍ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The payroll record <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                薪资记录 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                รายการเงินเดือน <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Bảng lương <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The payroll record "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isBannerContext =
        `${title || ''}`.toLowerCase().includes('banner') ||
        `${title || ''}`.includes('បដា') ||
        `${title || ''}`.includes('横幅') ||
        `${title || ''}`.includes('แบนเนอร์') ||
        `${title || ''}`.includes('biểu ngữ')

      if (isBannerContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ផ្ទាំងបដា <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The banner <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                横幅 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                แบนเนอร์ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Biểu ngữ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The banner "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      const isCouponContext =
        `${title || ''}`.toLowerCase().includes('coupon') ||
        `${title || ''}`.includes('ប័ណ្ណ') ||
        `${title || ''}`.includes('优惠券') ||
        `${title || ''}`.includes('คูปอง') ||
        `${title || ''}`.includes('phiếu giảm giá')

      if (isCouponContext) {
        return (
          <>
            {language === 'km' && (
              <>
                ប័ណ្ណបញ្ចុះតម្លៃ <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </>
            )}
            {language === 'en' && (
              <>
                The coupon <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be removed from the system. This action cannot be undone.
              </>
            )}
            {language === 'zh' && (
              <>
                优惠券 <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将从系统中删除，此操作无法撤销。
              </>
            )}
            {language === 'th' && (
              <>
                คูปอง <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </>
            )}
            {language === 'vi' && (
              <>
                Phiếu giảm giá <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </>
            )}
            {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
              <>
                The coupon "{itemName}" will be removed. This action cannot be undone.
              </>
            )}
          </>
        )
      }

      return (
        <>
          {language === 'km' && (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
            </>
          )}
          {language === 'en' && (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be deleted. This action cannot be undone.
            </>
          )}
          {language === 'zh' && (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">“{itemName}”</span> 将被删除，此操作无法撤销。
            </>
          )}
          {language === 'th' && (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้
            </>
          )}
          {language === 'vi' && (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> sẽ bị xóa. Hành động này không thể hoàn tác.
            </>
          )}
          {!['km', 'en', 'zh', 'th', 'vi'].includes(language) && (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span> will be deleted. This action cannot be undone.
            </>
          )}
        </>
      )
    }
    if (warningText) {
      return translateString(t(warningText, { defaultValue: warningText }))
    }
    if (detectedActionType === 'delete' || variant === 'danger') {
      const defaultDesc: Record<string, string> = {
        km: 'ទិន្នន័យនេះនឹងត្រូវលុបចេញពីប្រព័ន្ធ។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
        en: 'This item will be deleted from the system. This action cannot be undone.',
        zh: '该数据将被删除，此操作无法撤销。',
        th: 'รายการนี้จะถูกลบออกจากระบบ การดำเนินการนี้ไม่สามารถยกเลิกได้',
        vi: 'Mục này sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.',
      }
      return defaultDesc[language] || defaultDesc.en
    }
    if (detectedActionType === 'logout') {
      const logoutDesc: Record<string, string> = {
        km: 'សម័យការបច្ចុប្បន្នរបស់អ្នកនឹងត្រូវបានបញ្ចប់។',
        en: 'Your current session will be terminated.',
        zh: '您当前的会话将终止。',
        th: 'เซสชันปัจจุบันของคุณจะสิ้นสุดลง',
        vi: 'Phiên hiện tại của bạn sẽ bị chấm dứt.',
      }
      return logoutDesc[language] || logoutDesc.en
    }
    return null
  }

  const getCancel = () => {
    if (cancelText) return translateString(t(cancelText, { defaultValue: cancelText }))
    const cancels: Record<string, string> = {
      km: 'បោះបង់',
      en: 'Cancel',
      zh: '取消',
      th: 'ยกเลิก',
      vi: 'Hủy',
    }
    return cancels[language] || cancels.en
  }

  const getConfirm = () => {
    if (confirmText) return translateString(t(confirmText, { defaultValue: confirmText }))
    if (detectedActionType === 'logout') {
      const logouts: Record<string, string> = {
        km: 'ចាកចេញ',
        en: 'Sign Out',
        zh: '退出登录',
        th: 'ออกจากระบบ',
        vi: 'Đăng xuất',
      }
      return logouts[language] || logouts.en
    }
    if (detectedActionType === 'revoke') {
      const revokes: Record<string, string> = {
        km: 'ដកហូត',
        en: 'Revoke',
        zh: '撤销',
        th: 'เพิกถอน',
        vi: 'Thu hồi',
      }
      return revokes[language] || revokes.en
    }
    if (detectedActionType === 'restore') {
      const restores: Record<string, string> = {
        km: 'ស្តារឡើងវិញ',
        en: 'Restore',
        zh: '恢复',
        th: 'กู้คืน',
        vi: 'Khôi phục',
      }
      return restores[language] || restores.en
    }
    if (detectedActionType === 'delete' || variant === 'danger') {
      const confirms: Record<string, string> = {
        km: 'បញ្ជាក់ការលុប',
        en: 'Delete',
        zh: '确认删除',
        th: 'ยืนยันการลบ',
        vi: 'Xác nhận xóa',
      }
      return confirms[language] || confirms.en
    }
    const confirms: Record<string, string> = {
      km: 'យល់ព្រម',
      en: 'Confirm',
      zh: '确定',
      th: 'ตกลง',
      vi: 'Xác nhận',
    }
    return confirms[language] || confirms.en
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div key={language} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 min-h-screen">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isExecuting ? onCancel : undefined}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container Card - Clean, Compact & Balanced */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${config.badgeBg}`}>
                  <VariantIcon size={19} className={config.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {getTitle()}
                  </h3>
                  {getSubtitleContent() && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {getSubtitleContent()}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={isExecuting}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-40 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Optional Custom Message Body */}
            {message && (
              <div className="p-4 py-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                {typeof message === 'string'
                  ? (message.includes(' ') || message.includes('\n') || message.includes('?') || message.includes('。') || message.includes('។')
                      ? message
                      : translateString(t(message, { defaultValue: message })))
                  : message}
              </div>
            )}

            {/* Actions Footer - Clean inline buttons */}
            <div className="flex items-center justify-end gap-2.5 p-4 sm:p-5 pt-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isExecuting}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {getCancel()}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isExecuting}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 ${config.button}`}
              >
                {isExecuting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <VariantIcon size={14} />
                )}
                <span>{getConfirm()}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ConfirmModal
