import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface BreadcrumbItem {
  label: string
  path?: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '', showHome = true }) => {
  const { t } = useTranslation()

  return (
    <nav className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
      {showHome && (
        <Link to="/dashboard" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <Home size={12} />
          {t('nav.dashboard', 'Dashboard')}
        </Link>
      )}
      {items.map((item, index) => {
        const linkTarget = item.path || item.href
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-muted-foreground/50 flex-shrink-0" />
            {linkTarget && index < items.length - 1 ? (
              <Link to={linkTarget} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={index === items.length - 1 ? 'text-foreground font-medium' : ''}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
