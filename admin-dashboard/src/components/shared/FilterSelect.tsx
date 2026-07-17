import React from 'react'

interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string | number; label: string }[]
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm font-medium text-muted-foreground">{label}:</span>}
      <select
        className={`bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterSelect
