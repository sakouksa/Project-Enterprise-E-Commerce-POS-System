import React from 'react'
import ModernSelect from '@/components/shared/ModernSelect'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'

interface CMSFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterAuthor: string
  setFilterAuthor: (val: string) => void
  filterCategory: string
  setFilterCategory: (val: string) => void
  onReset: () => void
}

const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
)

export const CMSFilterDrawer: React.FC<CMSFilterDrawerProps> = ({
  isOpen, onClose,
  filterStatus, setFilterStatus,
  filterAuthor, setFilterAuthor,
  filterCategory, setFilterCategory,
  onReset,
}) => {
  const activeCount = [filterStatus !== 'all' ? filterStatus : '', filterAuthor !== 'all' ? filterAuthor : '', filterCategory !== 'all' ? filterCategory : ''].filter(Boolean).length

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title="Filter CMS Content"
      activeCount={activeCount}
    >
      <FL label="Publication Status">
        <ModernSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'published', label: 'Published Live' },
            { value: 'draft', label: 'Draft / Work in Progress' },
            { value: 'archived', label: 'Archived / Hidden' },
            { value: 'pending', label: 'Pending Editorial Review' },
          ]}
          placeholder="All Statuses"
        />
      </FL>

      <FL label="Author Filter">
        <ModernSelect
          value={filterAuthor}
          onChange={setFilterAuthor}
          options={[
            { value: 'all', label: 'All Authors' },
            { value: 'admin', label: 'System Admin' },
            { value: 'editor', label: 'Editor Team' },
            { value: 'guest', label: 'Guest Contributor' },
          ]}
          placeholder="All Authors"
        />
      </FL>

      <FL label="Content Category">
        <ModernSelect
          value={filterCategory}
          onChange={setFilterCategory}
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'news', label: 'Product News' },
            { value: 'tutorials', label: 'Guides & Tutorials' },
            { value: 'updates', label: 'Release Updates' },
            { value: 'case-studies', label: 'Case Studies' },
          ]}
          placeholder="All Categories"
        />
      </FL>
    </FilterDrawerShell>
  )
}

export default CMSFilterDrawer
