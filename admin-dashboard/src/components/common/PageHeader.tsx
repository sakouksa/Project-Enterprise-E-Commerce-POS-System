import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  action?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description, action }) => {
  const desc = subtitle || description
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {desc && <p className="text-muted-foreground text-sm mt-0.5">{desc}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default PageHeader
