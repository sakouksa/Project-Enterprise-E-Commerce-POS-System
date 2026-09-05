// Common shared components — barrel export
export { default as PageHeader }     from './PageHeader'
export { default as Breadcrumb }     from './Breadcrumb'
export { default as DataTable }      from './DataTable'
export type { Column }               from './DataTable'
export { default as FormDrawer }     from './FormDrawer'
export { default as StatusBadge }    from './StatusBadge'
export { default as SearchFilter }   from './SearchFilter'
export { default as EmptyState, EmptyState as GlobalEmptyState, TableEmptyState } from './EmptyState'
export type { EmptyStateProps, EmptyStateAction } from './EmptyState'
export { default as LoadingSpinner } from './LoadingSpinner'
export { default as EnterpriseSelect } from './EnterpriseSelect'
export type { EnterpriseSelectOption, EnterpriseSelectProps } from './EnterpriseSelect'
export { default as ModernSelect } from '../shared/ModernSelect'
export type { ModernSelectProps, Option as ModernSelectOption } from '../shared/ModernSelect'
export { default as ToggleSwitch }     from './ToggleSwitch'
export type { ToggleSwitchProps }       from './ToggleSwitch'
export { default as DeleteConfirmDialog } from './DeleteConfirmDialog'
export { default as ConfirmModal } from './ConfirmModal'
export type { ConfirmVariant, ConfirmModalProps } from './ConfirmModal'
export { default as TableActionMenu } from '../shared/TableActionMenu'
export type { TableActionItem } from '../shared/TableActionMenu'
export { default as FormHeader } from './FormHeader'
export type { FormHeaderProps } from './FormHeader'
export { default as FormFooter } from './FormFooter'
export type { FormFooterProps } from './FormFooter'
export {
  default as FormLayout,
  FormLayout as GlobalFormLayout,
  FormContent,
  FormCard,
  FormSection,
} from './FormLayout'
export type {
  FormLayoutProps,
  FormContentProps,
  FormCardProps,
  FormSectionProps,
  FormCardIconVariant,
  FormMaxWidth,
} from './FormLayout'
export { default as FileUpload } from './FileUpload'
export type { FileUploadProps } from './FileUpload'
export { default as IconColorPicker } from './IconColorPicker'
export type { IconColorPickerProps } from './IconColorPicker'
export { CATEGORY_ICONS_MAP, CATEGORY_COLORS, resolveCategoryVisual } from './categoryIconConstants'
export type { ColorDef } from './categoryIconConstants'
export { default as ModalHeader } from './ModalHeader'
export type { ModalHeaderProps, ModalHeaderIconVariant } from './ModalHeader'
export { default as ModalFooter } from './ModalFooter'
export type { ModalFooterProps } from './ModalFooter'
export { default as EnterpriseModal } from './EnterpriseModal'
export type { EnterpriseModalProps, ModalSize } from './EnterpriseModal'
export { default as CustomerAddressModal } from './CustomerAddressModal'
export type { CustomerAddressModalProps, CustomerAddress, AddressFormData } from './CustomerAddressModal'
export { default as CustomerGroupModal } from './CustomerGroupModal'
export type { CustomerGroupModalProps, CustomerGroup, CustomerGroupFormData } from './CustomerGroupModal'
export { default as PercentBadge } from './PercentBadge'
export { default as AppImage } from './AppImage'
export type { AppImageProps } from './AppImage'
export { default as AvatarImage } from './AvatarImage'
export type { AvatarImageProps } from './AvatarImage'
export type { PercentBadgeProps, PercentBadgeVariant } from './PercentBadge'
export {
  HeaderActionsGroup,
  AddButton,
  ActionButton,
  SecondaryButton,
  ExportButton,
  ImportButton,
  QrKioskButton,
  SaveButton,
  CancelButton,
  FilterButton,
  RefreshButton,
  ResetButton,
} from './GlobalActionButtons'
export type {
  HeaderActionsGroupProps,
  AddButtonProps,
  ActionButtonProps,
  ExportButtonProps,
  ImportButtonProps,
  QrKioskButtonProps,
  SaveButtonProps,
  CancelButtonProps,
  FilterButtonProps,
  RefreshButtonProps,
  ResetButtonProps,
} from './GlobalActionButtons'

export { default as RichTextEditor } from './RichTextEditor'
export type { RichTextEditorProps } from './RichTextEditor'

// Global Print & Official Document Standard Components
export { 
  GlobalPrintContainer, 
  GlobalPrintHeader, 
  GlobalPrintFooter,
  GlobalPrintContainer as PrintContainer,
  GlobalPrintHeader as PrintHeader,
  GlobalPrintFooter as PrintFooter,
} from '../shared/GlobalPrint'
export type { 
  GlobalPrintContainerProps,
  GlobalPrintHeaderProps, 
  CompanyPrintInfo,
  GlobalPrintFooterProps, 
  PrintSignatureRole 
} from '../shared/GlobalPrint'

// Global User Avatar Component
export { default as UserAvatar } from './UserAvatar'
export type { UserAvatarProps } from './UserAvatar'

// Global Standard Close Button Component
export { default as CloseButton } from './CloseButton'
export type { CloseButtonProps, CloseButtonVariant, CloseButtonSize } from './CloseButton'

// Global Standard Detail Drawer System
export {
  default as DetailDrawer,
  DetailDrawerHeader,
  DetailDrawerTabNav,
  DetailDrawerBody,
  DetailDrawerFooter,
  DetailDrawerCard,
  DetailDrawerRow,
} from './DetailDrawer'
export type {
  DetailDrawerProps,
  DetailDrawerSize,
  DetailDrawerIconVariant,
  DetailDrawerHeaderProps,
  DetailDrawerTabItem,
  DetailDrawerTabNavProps,
  DetailDrawerBodyProps,
  DetailDrawerFooterProps,
  DetailDrawerCardProps,
  DetailDrawerRowProps,
} from './DetailDrawer'

// Global Country Phone Input Component (5 supported countries)
export { default as CountryPhoneInput, SUPPORTED_PHONE_COUNTRIES } from './CountryPhoneInput'
export type { CountryPhoneInputProps, CountryPhoneConfig } from './CountryPhoneInput'

// Global Form Field Validation Components & Helpers
export { default as FormField, FieldError, FieldLabel, getFieldClass } from './FormField'
export type { FormFieldProps, FieldErrorProps, FieldLabelProps } from './FormField'

// Global Table Toolbar, Search, Filter & Settings Suite
export {
  default as TableToolbar,
  TableToolbar as GlobalTableToolbar,
  TableFilterToolbar,
  DataTableToolbar,
  SearchFilterToolbar,
} from './TableToolbar'
export type { TableToolbarProps } from './TableToolbar'

export { default as SearchInput } from '../shared/SearchInput'
export type { SearchInputProps } from '../shared/SearchInput'

export { default as ColumnSettingsPopover } from '../shared/ColumnSettingsPopover'
export type { ColumnOption } from '../shared/ColumnSettingsPopover'

export { default as ConfirmDialog } from '../shared/ConfirmDialog'
export type { ConfirmDialogProps } from '../shared/ConfirmDialog'

export { default as BulkSelectionBanner } from '../shared/BulkSelectionBanner'

// Global Enterprise KPI & Stats Cards Standard Suite
export {
  default as EnterpriseStatsCard,
  EnterpriseStatsCard as GlobalStatsCard,
  EnterpriseMiniStatsCard,
  EnterpriseStatsGrid,
  CircularProgressRing,
} from './EnterpriseStatsCard'
export { AnimatedCounter } from '../shared/AnimatedCounter'
export type {
  EnterpriseStatsCardProps,
  EnterpriseMiniStatsCardProps,
  EnterpriseStatsGridProps,
  CircularProgressRingProps,
  StatsCardVariant,
} from './EnterpriseStatsCard'
