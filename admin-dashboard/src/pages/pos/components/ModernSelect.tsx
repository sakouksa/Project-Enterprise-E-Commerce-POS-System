import React from 'react'
import EnterpriseSelect from '@/components/common/EnterpriseSelect'
import type { EnterpriseSelectOption, EnterpriseSelectProps } from '@/components/common/EnterpriseSelect'

export type SelectOption = EnterpriseSelectOption

export interface ModernSelectProps extends Omit<EnterpriseSelectProps, 'onChange'> {
  value?: string | number | (string | number)[]
  onChange?: (value: any) => void
  options?: SelectOption[]
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  value,
  onChange,
  options = [],
  icon,
  placeholder,
  className,
  buttonClassName,
  align,
  ...rest
}) => {
  return (
    <EnterpriseSelect
      value={value}
      onChange={(val) => onChange?.(val)}
      options={options}
      icon={icon}
      placeholder={placeholder}
      className={className}
      buttonClassName={buttonClassName}
      align={align}
      {...rest}
    />
  )
}

export default ModernSelect
