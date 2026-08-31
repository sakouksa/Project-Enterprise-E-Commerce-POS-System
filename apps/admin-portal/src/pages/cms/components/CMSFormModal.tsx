import React from 'react'
import {
  FileText,
  FolderOpen,
  Tag,
  FileCode,
  HelpCircle,
  Image as ImageIcon,
  X,
  UploadCloud,
  Layers,
  Globe,
  AlignLeft,
  Hash,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EnterpriseModal, ModalFooter, type ModalHeaderIconVariant } from '@/components/common'
import { generateSlug } from '@/utils/slug'
import type { Tab } from '../types'

export interface CMSFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingItem: any
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  activeTab: Tab
  getAddButtonLabel: () => string
  title: string
  setTitle: (val: string) => void
  name: string
  setName: (val: string) => void
  slug: string
  setSlug: (val: string) => void
  content: string
  setContent: (val: string) => void
  excerpt: string
  setExcerpt: (val: string) => void
  status: string
  setStatus: (val: string) => void
  description: string
  setDescription: (val: string) => void
  question: string
  setQuestion: (val: string) => void
  answer: string
  setAnswer: (val: string) => void
  faqCategory: string
  setFaqCategory: (val: string) => void
  sortOrder: string
  setSortOrder: (val: string) => void
  isActive: boolean
  setIsActive: (val: boolean) => void
  categoryId: string
  setCategoryId: (val: string) => void
  metaTitle: string
  setMetaTitle: (val: string) => void
  metaDescription: string
  setMetaDescription: (val: string) => void
  featuredImage: string
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveImage: () => void
  categoriesList: any[]
}

const labelCls = 'block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5'
const inputCls =
  'w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium'
const textareaCls =
  'w-full px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none'
const selectCls =
  'w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer'

export const CMSFormModal: React.FC<CMSFormModalProps> = ({
  isOpen,
  onClose,
  editingItem,
  onSubmit,
  isSubmitting,
  activeTab,
  title,
  setTitle,
  name,
  setName,
  slug,
  setSlug,
  content,
  setContent,
  excerpt,
  setExcerpt,
  status,
  setStatus,
  description,
  setDescription,
  question,
  setQuestion,
  answer,
  setAnswer,
  faqCategory,
  setFaqCategory,
  sortOrder,
  setSortOrder,
  isActive,
  setIsActive,
  categoryId,
  setCategoryId,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  featuredImage,
  handleFileChange,
  handleRemoveImage,
  categoriesList = [],
}) => {
  const { t } = useTranslation(['cms', 'common'])
  const isEdit = Boolean(editingItem)

  const getModalConfig = () => {
    switch (activeTab) {
      case 'blogs':
        return {
          title: isEdit ? t('cms.editBlog', 'Edit Article') : t('cms.addBlog', 'Add New Article'),
          subtitle: t('cms.formBlogSubtitle', 'Fill in article details, content, cover image, and SEO settings'),
          icon: <FileText size={20} />,
          variant: 'blue' as ModalHeaderIconVariant,
        }
      case 'blog-categories':
        return {
          title: isEdit ? t('cms.editCategory', 'Edit Category') : t('cms.addCategory', 'Add New Category'),
          subtitle: t('cms.formCategorySubtitle', 'Set category name, slug URL, description, and visibility'),
          icon: <FolderOpen size={20} />,
          variant: 'amber' as ModalHeaderIconVariant,
        }
      case 'blog-tags':
        return {
          title: isEdit ? t('cms.editTag', 'Edit Tag') : t('cms.addTag', 'Add New Tag'),
          subtitle: t('cms.formTagSubtitle', 'Create or edit tag label and slug URL'),
          icon: <Tag size={20} />,
          variant: 'purple' as ModalHeaderIconVariant,
        }
      case 'pages':
        return {
          title: isEdit ? t('cms.editPage', 'Edit Landing Page') : t('cms.addPage', 'Add Landing Page'),
          subtitle: t('cms.formPageSubtitle', 'Design page title, slug URL, and HTML/Markdown content'),
          icon: <FileCode size={20} />,
          variant: 'cyan' as ModalHeaderIconVariant,
        }
      case 'faqs':
        return {
          title: isEdit ? t('cms.editFaq', 'Edit FAQ') : t('cms.addFaq', 'Add New FAQ'),
          subtitle: t('cms.formFaqSubtitle', 'Enter question, detailed answer, and category grouping'),
          icon: <HelpCircle size={20} />,
          variant: 'sky' as ModalHeaderIconVariant,
        }
      default:
        return {
          title: isEdit ? t('cms.editContent', 'Edit Content') : t('cms.addContent', 'Add New Content'),
          subtitle: t('cms.cmsSubtitle', 'Manage CMS content records and settings'),
          icon: <Layers size={20} />,
          variant: 'emerald' as ModalHeaderIconVariant,
        }
    }
  }

  const config = getModalConfig()

  return (
    <EnterpriseModal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      subtitle={config.subtitle}
      icon={config.icon}
      iconVariant={config.variant}
      size="xl"
      badge={
        isEdit && editingItem?.id ? (
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
            #{editingItem.id}
          </span>
        ) : undefined
      }
      footer={
        <ModalFooter
          onCancel={onClose}
          isSubmitting={isSubmitting}
          isEdit={isEdit}
          cancelLabel={t('cms.cancel', t('common.cancel', 'Cancel'))}
          submitLabel={
            isEdit
              ? t('cms.saveChanges', t('common.saveChanges', 'Save Changes'))
              : t('cms.saveContent', t('common.save', 'Save Content'))
          }
          onSubmit={(e) => onSubmit(e || ({ preventDefault: () => {} } as any))}
        />
      }
    >
      <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-4">
        {/* ══════════════════════════════════════════════════
            1. BLOG CATEGORIES FORM
        ══════════════════════════════════════════════════ */}
        {activeTab === 'blog-categories' && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>
                {t('cms.formCategoryName', 'Category Name')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!slug || slug === generateSlug(name)) {
                    setSlug(generateSlug(e.target.value))
                  }
                }}
                placeholder="e.g. Technology News"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>{t('cms.colSlug', 'Slug URL')}</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="technology-news"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div>
              <label className={labelCls}>{t('cms.formCategoryDesc', 'Description')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('cms.formCategoryDesc', 'Overview description of this category...')}
                rows={3}
                className={textareaCls}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 dark:bg-slate-800/40 border border-border/70 dark:border-slate-700/70">
              <div>
                <p className="text-xs font-semibold text-foreground">{t('cms.formActiveStatus', 'Active Status')}</p>
                <p className="text-[11px] text-muted-foreground">{t('cms.formActiveStatusDesc', 'Show this category in the public blog')}</p>
              </div>
              <input
                type="checkbox"
                id="catActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded-md text-primary border-border focus:ring-primary cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            2. BLOG TAGS FORM
        ══════════════════════════════════════════════════ */}
        {activeTab === 'blog-tags' && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>
                {t('cms.formTagName', 'Tag Name')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!slug || slug === generateSlug(name)) {
                    setSlug(generateSlug(e.target.value))
                  }
                }}
                placeholder="e.g. React, E-Commerce, Tutorials"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>{t('cms.colSlug', 'Slug URL')}</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="react-e-commerce"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            3. BLOGS / ARTICLES FORM
        ══════════════════════════════════════════════════ */}
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>
                {t('cms.formArticleHeadline', 'Article Headline')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!slug || slug === generateSlug(title)) {
                    setSlug(generateSlug(e.target.value))
                  }
                }}
                placeholder={t('cms.formArticleHeadlinePlaceholder', 'e.g. Top 10 Tips for Modern Retail Management')}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelCls}>{t('cms.colSlug', 'Slug URL')}</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-headline-slug"
                  className={`${inputCls} font-mono text-xs`}
                />
              </div>

              <div>
                <label className={labelCls}>{t('cms.colCategory', 'Category')}</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">{t('cms.generalUncategorized', 'General / Uncategorized')}</option>
                  {categoriesList.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>{t('cms.formExcerpt', 'Excerpt Summary')}</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={t('cms.formExcerptPlaceholder', 'Brief summary for display cards and search results...')}
                rows={2}
                className={textareaCls}
              />
            </div>

            <div>
              <label className={labelCls}>{t('cms.formFullContent', 'Full Article Body')}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('cms.formFullContentPlaceholder', 'Write full article body here...')}
                rows={4}
                className={`${textareaCls} font-mono leading-relaxed`}
              />
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className={labelCls}>{t('cms.formCoverImage', 'Cover Image')}</label>
              {featuredImage ? (
                <div className="relative rounded-xl overflow-hidden border border-border/80 group bg-muted/40">
                  <img src={featuredImage} alt="Cover Preview" className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors shadow-md cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-border/80 dark:border-slate-700/80 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-background dark:bg-slate-900/50 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-1.5">
                    <UploadCloud size={18} />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{t('cms.formClickUpload', 'Click to upload cover image')}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{t('cms.formUploadHint', 'PNG, JPG, WebP up to 5MB')}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelCls}>{t('cms.colStatus', 'Publishing Status')}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={selectCls}
                >
                  <option value="published">{t('cms.publishedLive', 'Published (Live)')}</option>
                  <option value="draft">{t('cms.draftWip', 'Draft (WIP)')}</option>
                  <option value="archived">{t('cms.archivedHidden', 'Archived')}</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>{t('cms.formSeoTitle', 'SEO Meta Title')}</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={t('cms.formSeoTitlePlaceholder', 'Meta title for Google Search...')}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            4. LANDING PAGES FORM
        ══════════════════════════════════════════════════ */}
        {activeTab === 'pages' && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>
                {t('cms.formPageTitle', 'Page Title')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!slug || slug === generateSlug(title)) {
                    setSlug(generateSlug(e.target.value))
                  }
                }}
                placeholder="e.g. Privacy Policy & Terms of Service"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>{t('cms.colSlug', 'Slug URL')}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                  /
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="privacy-policy"
                  className={`${inputCls} pl-7 font-mono text-xs`}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>{t('cms.formPageContent', 'Page Content (HTML / Markdown)')}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('cms.formPageContentPlaceholder', 'Enter page body text or HTML markup...')}
                rows={5}
                className={`${textareaCls} font-mono leading-relaxed`}
              />
            </div>

            <div>
              <label className={labelCls}>{t('cms.colStatus', 'Status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={selectCls}
              >
                <option value="published">{t('cms.published', 'Published')}</option>
                <option value="draft">{t('cms.drafts', 'Draft')}</option>
              </select>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            5. FAQS FORM
        ══════════════════════════════════════════════════ */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>
                {t('cms.formQuestion', 'Question')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t('cms.formQuestionPlaceholder', 'e.g. How do I track my order delivery?')}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                {t('cms.formAnswer', 'Answer')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={t('cms.formAnswerPlaceholder', 'Detailed answer explanation for customers...')}
                rows={4}
                className={textareaCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelCls}>{t('cms.formFaqCategory', 'FAQ Category')}</label>
                <input
                  type="text"
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  placeholder={t('cms.formFaqCategoryPlaceholder', 'e.g. Orders, Delivery, Payments')}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>{t('cms.formSortOrder', 'Sort Order')}</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 dark:bg-slate-800/40 border border-border/70 dark:border-slate-700/70">
              <div>
                <p className="text-xs font-semibold text-foreground">{t('cms.formActiveFaq', 'Active FAQ')}</p>
                <p className="text-[11px] text-muted-foreground">{t('cms.formActiveFaqDesc', 'Show this question in the public Help & FAQ center')}</p>
              </div>
              <input
                type="checkbox"
                id="faqActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded-md text-primary border-border focus:ring-primary cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}
      </form>
    </EnterpriseModal>
  )
}

export default CMSFormModal
