import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Image as ImageIcon,
  X,
  UploadCloud,
  Globe,
  Tag as TagIcon,
  FolderOpen,
  Calendar,
  Layers,
  Eye,
  CheckCircle2,
  Send,
  Sparkles,
  Clock,
  ExternalLink,
  Share2,
} from 'lucide-react'
import { cmsService } from '@/services/cmsService'
import { useToast } from '@/hooks/useToast'
import { FormHeader, FormFooter, LoadingSpinner, RichTextEditor } from '@/components/common'
import CustomErrorMessage from '@/components/ui/CustomErrorMessage'
import { getAbsoluteImageUrl } from '@/utils/image'
import { generateSlug } from '@/utils/slug'

export const BlogFormPage: React.FC = () => {
  const { t, i18n } = useTranslation(['cms', 'common', 'nav'])
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const blogId = id ? parseInt(id, 10) : null
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('published')
  const [publishedAt, setPublishedAt] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isBroadcasting, setIsBroadcasting] = useState(false)

  // Fetch blog detail if in edit mode
  const {
    data: blogDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['blog-detail', blogId],
    queryFn: () => (blogId ? cmsService.getBlog(blogId) : null),
    enabled: isEdit && !isNaN(blogId as number),
  })

  // Fetch categories dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories-dropdown'],
    queryFn: () => cmsService.getCategories({ per_page: 100 }),
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (blogDetail) {
      setTitle(blogDetail.title || '')
      setSlug(blogDetail.slug || '')
      setCategoryId(blogDetail.blog_category_id?.toString() || blogDetail.category_id?.toString() || '')
      setExcerpt(blogDetail.excerpt || '')
      setContent(blogDetail.content || '')
      setStatus(blogDetail.status || 'published')
      setPublishedAt(blogDetail.published_at ? blogDetail.published_at.substring(0, 16) : '')
      setMetaTitle(blogDetail.meta_title || '')
      setMetaDescription(blogDetail.meta_description || '')
      const img = blogDetail.featured_image || blogDetail.image || blogDetail.image_url
      setFeaturedImage(img ? getAbsoluteImageUrl(img) : '')
    }
  }, [blogDetail])

  // Word count & read time calculation
  const stats = useMemo(() => {
    const text = (content || '').replace(/<[^>]*>/g, ' ').trim()
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0
    const readTimeMin = Math.max(1, Math.ceil(words / 180))
    return { words, readTimeMin }
  }, [content])

  // Handle Cover image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setFeaturedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setFeaturedImage('')
  }

  // Create & Update mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => cmsService.createBlog(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogs'] })
      qc.invalidateQueries({ queryKey: ['cms-stats'] })
      toast.success(t('cms.createdSuccess', 'Content created successfully.'))
      navigate('/cms?tab=blogs')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('cms.createFailed', 'Failed to create article.'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => cmsService.updateBlog(blogId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogs'] })
      qc.invalidateQueries({ queryKey: ['cms-stats'] })
      qc.invalidateQueries({ queryKey: ['blog-detail', blogId] })
      toast.success(t('cms.updatedSuccess', 'Content updated successfully.'))
      navigate('/cms?tab=blogs')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('cms.updateFailed', 'Failed to update article.'))
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleTelegramBroadcast = async () => {
    if (!title.trim()) {
      toast.error(t('cms.titleRequired', 'Please enter article title first'))
      return
    }
    setIsBroadcasting(true)
    try {
      await cmsService.broadcastToTelegram({
        title: title.trim(),
        message: excerpt.trim() || title.trim(),
        link: `${window.location.origin}/blogs/${slug || generateSlug(title)}`,
        image_url: featuredImage || undefined,
      })
      toast.success(t('cms.telegramBroadcastSuccess', 'Article broadcasted to Telegram Channel successfully!'))
    } catch {
      toast.error(t('cms.telegramBroadcastFailed', 'Failed to broadcast to Telegram.'))
    } finally {
      setIsBroadcasting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error(t('cms.titleRequired', 'Please enter article title first'))
      return
    }

    const payload: any = {
      company_id: 1,
      blog_category_id: categoryId ? Number(categoryId) : null,
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim(),
      summary: excerpt.trim(),
      content: content.trim(),
      status,
      published_at: publishedAt || null,
      meta_title: metaTitle.trim(),
      meta_description: metaDescription.trim(),
    }

    if (imageFile) {
      payload.featured_image = featuredImage
    } else if (isEdit && blogDetail?.featured_image) {
      payload.featured_image = blogDetail.featured_image
    }

    if (isEdit && blogId) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const labelCls = 'block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5'
  const inputCls =
    'w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium'
  const textareaCls =
    'w-full px-3.5 py-2.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none'
  const selectCls =
    'w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer'

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <LoadingSpinner />
        <p className="text-xs text-muted-foreground mt-3">{t('common.loading', 'Loading data...')}</p>
      </div>
    )
  }

  if (isEdit && isErrorDetail) {
    return (
      <div className="p-6">
        <CustomErrorMessage
          title={t('common.errorLoading', 'Failed to load article data')}
          message={(detailError as any)?.message || t('common.error', 'An error occurred')}
          onRetry={refetchDetail}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Global Form Header */}
      <FormHeader
        isEdit={isEdit}
        title={
          isEdit
            ? t('cms.editBlogTitle', 'Edit Article: {{title}}', { title: title || '' })
            : t('cms.addBlog', 'Add New Article')
        }
        subtitle={t('cms.formBlogSubtitle', 'Fill in article details, content, cover image, and SEO settings')}
        breadcrumbs={[
          { label: t('cms.contentManagement', 'Content Management'), path: '/cms?tab=blogs' },
          {
            label: isEdit ? t('cms.editBlog', 'Edit Article') : t('cms.addBlog', 'Add New Article'),
          },
        ]}
        backPath="/cms?tab=blogs"
        backLabel={t('common.back', 'Back')}
      />

      {/* Form Container (2-Column Grid Layout) */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN (2 COLS): Main Body & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-card border border-border/80 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t('cms.sectionBasicInfo', 'General Info & Title')}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('cms.basicInfoHelp', 'Enter primary title and article slug URL')}
                    </p>
                  </div>
                </div>

                {/* Read time badge */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-primary" />
                    <span>~{stats.readTimeMin} min read</span>
                  </span>
                  <span>•</span>
                  <span>{stats.words} words</span>
                </div>
              </div>

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

                <div>
                  <label className={labelCls}>{t('cms.colSlug', 'Slug URL')}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                      /blogs/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="top-10-tips-retail-management"
                      className={`${inputCls} pl-16 font-mono text-xs`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Article Body & Rich Editor */}
            <div className="bg-card border border-border/80 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t('cms.sectionContent', 'Body & Content')}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('cms.contentHelp', 'Summary excerpt and full rich text')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder={t('cms.formFullContentPlaceholder', 'Write your complete article content here...')}
                    articleTitle={title}
                    featuredImage={featuredImage}
                    minHeight="380px"
                  />
                </div>
              </div>
            </div>

            {/* SEO Live Preview: Google SERP & Telegram Social Share */}
            <div className="bg-card border border-border/80 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t('cms.sectionSeoPublish', 'SEO & Social Share Preview')}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('cms.seoHelp', 'Optimize search engine discovery and social card appearance')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t('cms.formSeoTitle', 'SEO Meta Title')}</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title || 'Meta title for Google search...'}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>{t('cms.metaDescription', 'SEO Meta Description')}</label>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder={excerpt || 'Brief description for search snippet...'}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Google SERP Snippet Preview Card */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Globe size={12} className="text-blue-500" />
                    <span>Google Search Result Snippet</span>
                  </div>
                  <div className="font-sans">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>https://optapos.io › blogs › {slug || 'article-slug'}</span>
                    </p>
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 mt-0.5">
                      {metaTitle || title || 'OptaPOS Article Headline'}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {metaDescription || excerpt || 'Detailed description of the article will appear here in Google search engine snippets for Cambodian shoppers...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (1 COL): Sidebar & Actions */}
          <div className="space-y-6">
            {/* Publication Settings */}
            <div className="bg-card border border-border/80 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {t('cms.publicationSettings', 'Publication Settings')}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelCls}>{t('cms.colStatus', 'Publishing Status')}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={selectCls}
                  >
                    <option value="published">{t('cms.publishedLive', 'Published (Live)')}</option>
                    <option value="draft">{t('cms.draftWip', 'Draft (WIP)')}</option>
                    <option value="scheduled">{t('cms.scheduled', 'Scheduled Publishing')}</option>
                    <option value="archived">{t('cms.archivedHidden', 'Archived')}</option>
                  </select>
                </div>

                {/* Schedule Publishing Date/Time */}
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" />
                      <span>{t('cms.schedulePublish', 'Publish Date & Time')}</span>
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className={inputCls}
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
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Cover Photo */}
            <div className="bg-card border border-border/80 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold shrink-0">
                  <ImageIcon size={16} />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {t('cms.formCoverImage', 'Cover Image')}
                </h3>
              </div>

              <div>
                {featuredImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-border/80 group bg-muted/40 shadow-xs">
                    <img src={featuredImage} alt="Cover Preview" className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-lg cursor-pointer transition-colors shadow-md text-xs font-bold flex items-center gap-1.5">
                        <UploadCloud size={14} />
                        <span>{t('cms.changePhoto', 'Change Photo')}</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-colors shadow-md"
                        title={t('cms.removePhoto', 'Remove Photo')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-border/80 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-muted/20 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-2">
                      <UploadCloud size={22} />
                    </div>
                    <span className="text-xs font-semibold text-foreground text-center">{t('cms.formClickUpload', 'Click to upload cover image')}</span>
                    <span className="text-[11px] text-muted-foreground mt-1 text-center">{t('cms.formUploadHint', 'PNG, JPG, WebP up to 5MB')}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Telegram Channel Broadcast Action */}
            <div className="bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Send size={15} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-xs sm:text-sm">
                    {t('cms.telegramBroadcast', 'Telegram Broadcast')}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {t('cms.telegramBroadcastDesc', 'Send new post instant notification to your subscribers')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTelegramBroadcast}
                disabled={isBroadcasting}
                className="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>{isBroadcasting ? t('common.sending', 'Broadcasting...') : t('cms.broadcastNow', 'Broadcast to Channel')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Form Footer */}
        <FormFooter
          cancelPath="/cms?tab=blogs"
          cancelLabel={t('common.cancel', 'Cancel')}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          submitLabel={
            isEdit
              ? t('cms.saveChanges', 'Save Changes')
              : t('cms.saveContent', 'Save Article')
          }
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  )
}

export default BlogFormPage
