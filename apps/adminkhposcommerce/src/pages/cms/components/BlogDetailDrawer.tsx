import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Calendar,
  Tag as TagIcon,
  User,
  Clock,
  Globe,
  Copy,
  Check,
  Edit3,
  X,
  BookOpen,
  Sparkles,
  Printer,
} from 'lucide-react'
import { StatusBadge, AppImage, CloseButton, CancelButton } from '@/components/common'
import { useToast } from '@/hooks/useToast'
import { getAbsoluteImageUrl } from '@/utils/image'

export interface BlogDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  blog: any | null
}

export const BlogDetailDrawer: React.FC<BlogDetailDrawerProps> = ({
  isOpen,
  onClose,
  blog,
}) => {
  const { t } = useTranslation(['cms', 'common', 'buttons'])
  const navigate = useNavigate()
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !blog) return null

  const title = blog.title || ''
  const slug = blog.slug || ''
  const excerpt = blog.excerpt || blog.summary || ''
  const content = blog.content || ''
  const status = (blog.status || 'published').toLowerCase()
  const categoryName =
    blog.blog_category?.name ||
    blog.category?.name ||
    blog.category_name ||
    t('cms.general', 'General')
  const authorName =
    blog.author?.name ||
    blog.author_name ||
    blog.user?.name ||
    t('cms.systemAdmin', 'System Admin')
  const coverImage = blog.featured_image || blog.image || blog.image_url
  const blogIndex = blog?.id ? ((Number(blog.id) - 1) % 10) + 1 : 1
  const dynamicFallback = `/images/blogs/blog-${String(blogIndex).padStart(2, '0')}.jpg`
  const metaTitle = blog.meta_title || title
  const metaDescription = blog.meta_description || excerpt || title
  const createdAt = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null
  const publishedAt = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : createdAt

  // Estimate word count and reading time
  const plainText = content.replace(/<[^>]+>/g, ' ').trim()
  const wordCount = plainText ? plainText.split(/\s+/).length : 0
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200))

  const handleCopySlug = () => {
    const fullUrl = `${window.location.origin}/blog/${slug}`
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    toast.success(t('cms.linkCopied', 'Article link copied successfully!'))
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    onClose()
    navigate(`/cms/blogs/${blog.id}/edit`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Slide-Over Drawer Container (Right Side) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden pointer-events-auto z-10"
            >
              {/* ─── 1. Header Bar ─── */}
              <div className="p-5 sm:px-6 border-b border-border/80 bg-gradient-to-b from-muted/40 via-card to-card flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <BookOpen size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-foreground truncate">
                        {t('cms.blogDetail', 'Article Details')}
                      </h2>
                      <StatusBadge status={status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {t(
                        'cms.blogDetailSubtitle',
                        'View full article details, rich content, and SEO metadata'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title={t('cms.print_article', 'Print Article')}
                  >
                    <Printer size={17} />
                  </button>
                  <CloseButton onClose={onClose} size="md" color="rose" />
                </div>
              </div>

              {/* ─── 2. Scrollable Body ─── */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Cover Hero Banner */}
                <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden border border-border/80 bg-muted/60 shadow-xs group">
                  <AppImage
                    src={coverImage ? getAbsoluteImageUrl(coverImage) : undefined}
                    alt={title}
                    fallbackType="general"
                    fallbackSrc={dynamicFallback}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    preview={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xs">
                        <TagIcon size={12} />
                        <span>{categoryName}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
                        <Clock size={11} />
                        <span>
                          {t('cms.readingTimeMin', {
                            min: readingTimeMin,
                            defaultValue: `~${readingTimeMin} min read`,
                          })}
                        </span>
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow-md">
                      {title}
                    </h1>
                  </div>
                </div>

                {/* Metadata Information Cards (Clean 2-Column Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Card 1: Author */}
                  <div className="p-3.5 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/80 shadow-2xs">
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {t('cms.author', 'Author')}
                    </p>
                    <p className="text-xs sm:text-[13px] font-bold text-foreground truncate mt-0.5">
                      {authorName}
                    </p>
                  </div>

                  {/* Card 2: Published Date */}
                  <div className="p-3.5 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/80 shadow-2xs">
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {t('cms.publishedOn', 'Published On')}
                    </p>
                    <p className="text-xs sm:text-[13px] font-bold text-foreground truncate mt-0.5">
                      {publishedAt || '-'}
                    </p>
                  </div>

                  {/* Card 3: Word Count & Read Time */}
                  <div className="p-3.5 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/80 shadow-2xs">
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {t('cms.wordCount', 'Word Count')}
                    </p>
                    <p className="text-xs sm:text-[13px] font-bold text-foreground font-mono mt-0.5">
                      {wordCount} {t('cms.words', 'words')}
                    </p>
                  </div>

                  {/* Card 4: URL Slug & Copy Button */}
                  <div className="p-3.5 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/80 flex items-center justify-between gap-2 shadow-2xs group">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {t('cms.colSlug', 'Slug URL')}
                      </p>
                      <p className="text-xs sm:text-[13px] font-bold font-mono text-foreground truncate mt-0.5" title={`/${slug}`}>
                        /{slug}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySlug}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                      title={t('cms.copyLink', 'Copy Link')}
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Segmented Tab Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/80">
                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'content'
                        ? 'bg-card text-foreground shadow-xs border border-border/60'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{t('cms.articleBody', 'Full Article Content')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'seo'
                        ? 'bg-card text-foreground shadow-xs border border-border/60'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>
                      {t('cms.seoSettings', 'SEO & Google SERP Preview')}
                    </span>
                  </button>
                </div>

                {/* Tab 1: Content View */}
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    {/* Excerpt / Summary Callout */}
                    {excerpt && (
                      <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-amber-500 text-foreground text-sm font-medium italic leading-relaxed">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 not-italic uppercase tracking-wider mb-1">
                          {t('cms.articleExcerpt', 'Article Excerpt')}
                        </p>
                        "{excerpt}"
                      </div>
                    )}

                    {/* Rich HTML / Plain Text Content */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-2xs">
                      {content ? (
                        <div
                          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl leading-relaxed text-foreground"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ) : (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                          <FileText
                            size={32}
                            className="mx-auto mb-2 opacity-40"
                          />
                          <p>
                            {t(
                              'cms.noContent',
                              'No content written yet.'
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: SEO & Google SERP Simulator */}
                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Globe size={16} className="text-primary" />
                          <span>
                            {t(
                              'cms.googlePreview',
                              'Google Search Appearance'
                            )}
                          </span>
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                          SERP Simulator
                        </span>
                      </div>

                      {/* Google SERP Card */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-border/80 shadow-xs font-sans space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-mono truncate">
                          <Globe size={13} className="shrink-0" />
                          <span className="truncate">
                            https://optapos.com &gt; blog &gt; {slug}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-1">
                          {metaTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-normal">
                          {metaDescription}
                        </p>
                      </div>

                      {/* Metadata Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            Meta Title
                          </p>
                          <p className="text-xs font-semibold text-foreground break-words">
                            {metaTitle}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {metaTitle.length} characters (Recommended: 50-60)
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            Meta Description
                          </p>
                          <p className="text-xs font-semibold text-foreground break-words">
                            {metaDescription}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {metaDescription.length} characters (Recommended:
                            120-160)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── 3. Action Footer ─── */}
              <div className="p-4 sm:px-6 bg-muted/40 dark:bg-slate-900/60 border-t border-border flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySlug}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs select-none"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>
                    {copied
                      ? t('cms.linkCopied', 'Copied!')
                      : t('cms.copyLink', 'Copy Link')}
                  </span>
                </button>

                <div className="flex items-center gap-2.5">
                  <CancelButton onClick={onClose} label={t('buttons.close', 'Close')} />

                  <button
                    type="button"
                    onClick={handleEdit}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>{t('cms.editArticle', 'Edit Article')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BlogDetailDrawer
