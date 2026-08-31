import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Globe,
  Tag,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  Link as LinkIcon,
  CheckCircle2,
  LayoutTemplate,
  ExternalLink,
  Info,
} from 'lucide-react'
import { marketingService } from '@/services/marketingService'
import { useToast } from '@/hooks/useToast'
import { FormHeader, FormFooter, LoadingSpinner } from '@/components/common'
import { getAbsoluteImageUrl } from '@/utils/image'

export const BannerFormPage: React.FC = () => {
  const { t } = useTranslation(['marketing', 'cms', 'common', 'toast'])
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const bannerId = id ? parseInt(id, 10) : null
  const navigate = useNavigate()
  const location = useLocation()
  const qc = useQueryClient()
  const toast = useToast()

  // Determine back path (if navigated from /marketing/banners or /cms?tab=banners)
  const isFromCms = location.pathname.startsWith('/cms') || location.search.includes('tab=banners')
  const backPath = isFromCms ? '/cms?tab=banners' : '/marketing/banners'

  // Form states
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [badge, setBadge] = useState('')
  const [discountTag, setDiscountTag] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [base64Image, setBase64Image] = useState<string>('')
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [linkUrl, setLinkUrl] = useState('')
  const [position, setPosition] = useState<'hero' | 'sidebar' | 'popup' | 'footer'>('hero')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [isActive, setIsActive] = useState<boolean>(true)
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  // Fetch banner detail if in edit mode
  const {
    data: bannerDetail,
    isLoading: isLoadingDetail,
  } = useQuery({
    queryKey: ['banner-detail', bannerId],
    queryFn: () => (bannerId ? marketingService.getBanner(bannerId) : null),
    enabled: isEdit && !isNaN(bannerId as number),
  })

  useEffect(() => {
    if (bannerDetail) {
      setTitle(bannerDetail.title || '')
      setSubtitle(bannerDetail.subtitle || '')
      setBadge(bannerDetail.badge || '')
      setDiscountTag(bannerDetail.discount_tag || '')
      const img = bannerDetail.image_url || bannerDetail.image || ''
      setImageUrl(img)
      setImageMode(img.startsWith('http') || img.startsWith('/storage') ? 'url' : 'upload')
      setLinkUrl(bannerDetail.link_url || bannerDetail.link || '')
      setPosition((bannerDetail.position as any) || 'hero')
      setSortOrder(bannerDetail.sort_order ?? 0)
      setIsActive(bannerDetail.is_active ?? true)
      setStartsAt(bannerDetail.starts_at ? bannerDetail.starts_at.split(/[T ]/)[0] : '')
      setEndsAt(bannerDetail.ends_at ? bannerDetail.ends_at.split(/[T ]/)[0] : '')
    }
  }, [bannerDetail])

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)

      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBase64Image(reader.result)
        }
      }
      reader.readAsDataURL(file)

      toast.success(t('toast.fileSelected', { fileName: file.name, defaultValue: `File "${file.name}" selected.` }))
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setBase64Image('')
    setImageUrl('')
  }

  // Create & Update mutations
  const createMutation = useMutation({
    mutationFn: (newBanner: any) => marketingService.createBanner(newBanner),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      qc.invalidateQueries({ queryKey: ['cms-records'] })
      qc.invalidateQueries({ queryKey: ['cms-stats'] })
      toast.success(t('toast.created', { item: t('marketing.banners', 'Banner') }))
      navigate(backPath)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to create banner'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => marketingService.updateBanner(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      qc.invalidateQueries({ queryKey: ['cms-records'] })
      qc.invalidateQueries({ queryKey: ['cms-stats'] })
      qc.invalidateQueries({ queryKey: ['banner-detail', bannerId] })
      toast.success(t('toast.updated', { item: t('marketing.banners', 'Banner') }))
      navigate(backPath)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to update banner'))
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!title.trim()) {
      toast.error(t('toast.required', { field: t('marketing.bannerTitle', 'Banner Title') }))
      return
    }
    if (!selectedFile && !imageUrl.trim()) {
      toast.error(t('toast.required', { field: t('marketing.bannerImage', 'Banner Image') }))
      return
    }

    const formData = new FormData()
    formData.append('company_id', '1')
    formData.append('title', title.trim())
    formData.append('subtitle', subtitle.trim())
    formData.append('badge', badge.trim())
    formData.append('discount_tag', discountTag.trim())
    formData.append('position', position)
    formData.append('sort_order', String(sortOrder))
    formData.append('is_active', isActive ? '1' : '0')
    if (startsAt) formData.append('starts_at', startsAt)
    if (endsAt) formData.append('ends_at', endsAt)
    if (linkUrl) formData.append('link', linkUrl.trim())

    if (selectedFile && selectedFile instanceof File) {
      formData.append('image_file', selectedFile)
      if (base64Image) {
        formData.append('image', base64Image)
      }
    } else if (imageUrl && !imageUrl.startsWith('blob:') && !imageUrl.includes('/storage/[]') && imageUrl !== '[]') {
      formData.append('image', imageUrl)
      formData.append('image_url', imageUrl)
    }

    if (isEdit && bannerId) {
      formData.append('_method', 'PUT')
      updateMutation.mutate({ id: bannerId, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const resolveDisplayImage = (url?: string): string => {
    if (!url || url === '[]' || url === '""' || url.includes('/storage/[]')) {
      return '/logo.png'
    }
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url
    }
    return getAbsoluteImageUrl(url) || '/logo.png'
  }

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ─── Standard Form Header ─── */}
      <FormHeader
        isEdit={isEdit}
        title={
          isEdit
            ? t('marketing.editBanner', 'Edit Banner')
            : t('marketing.addBanner', 'Add New Banner')
        }
        subtitle={t('marketing.bannerSubtitle', 'Manage promotional banners and campaign marketing assets')}
        breadcrumbs={[
          { label: t('cms.dashboard', 'Dashboard'), path: '/dashboard' },
          { label: t('cms.contentManagement', 'Content & CMS'), path: '/cms?tab=banners' },
          { label: t('marketing.banners', 'Banners'), path: backPath },
          { label: isEdit ? `#${bannerId}` : t('marketing.addBanner', 'Create New') },
        ]}
        statusBadge={
          isEdit ? (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {isActive ? t('marketing.active', 'Active') : t('marketing.inactive', 'Inactive')}
            </span>
          ) : undefined
        }
        onBack={() => navigate(backPath)}
        backLabel={t('common.back', 'Back')}
      />

      {/* ─── Form Body ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ══════════════════════════════════════════════════════════
              LEFT COLUMN: Main Content & Media (7/8 cols)
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* General Info Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Info size={16} />
                </div>
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  {t('marketing.bannerContentSection', 'General Info & Banner Content')}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Banner Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">
                    {t('marketing.bannerTitle', 'Banner Title')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder={t('marketing.bannerTitlePlaceholder', 'e.g. NEXT-GEN PRO GAMING ARENA')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs font-medium placeholder:text-muted-foreground/60"
                  />
                </div>

                {/* Subtitle / Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">
                    {t('marketing.bannerDescription', 'Subtitle / Description')}
                  </label>
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    rows={2}
                    placeholder={t('marketing.bannerDescPlaceholder', 'e.g. Professional gaming gear RTX 5090, 240Hz OLED Displays...')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-2xs font-medium placeholder:text-muted-foreground/60"
                  />
                </div>

                {/* Badge Label & Discount Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      {t('marketing.badgeLabel', 'Badge Label')}
                    </label>
                    <div className="relative">
                      <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder={t('marketing.badgePlaceholder', 'e.g. Official Store')}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs font-medium placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      {t('marketing.discountTag', 'Discount Tag')}
                    </label>
                    <div className="relative">
                      <Sparkles size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={discountTag}
                        onChange={(e) => setDiscountTag(e.target.value)}
                        placeholder={t('marketing.discountPlaceholder', 'e.g. 35% OFF')}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs font-medium placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Image Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <ImageIcon size={16} />
                  </div>
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    {t('marketing.bannerMediaSection', 'Image & Destination Link')}
                  </h3>
                </div>

                {/* Upload Mode Pill Switcher */}
                <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-xl border border-border/60">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      imageMode === 'upload'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('marketing.fileUpload', 'Upload Image')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      imageMode === 'url'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('marketing.imageUrl', 'Image URL')}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Upload Zone / Preview */}
                {imageMode === 'upload' ? (
                  imageUrl ? (
                    <div className="relative group border border-border rounded-2xl p-4 bg-muted/20 flex items-center justify-between gap-4 shadow-2xs">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <img
                          src={resolveDisplayImage(imageUrl)}
                          alt="Banner preview"
                          className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-xl border border-border shadow-xs shrink-0 bg-slate-950"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/logo.png'
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {selectedFile ? selectedFile.name : title || 'Banner Media'}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : imageUrl}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={11} /> {t('marketing.readyToPublish', 'Ready to Publish')}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                        title={t('common.remove', 'Remove Image')}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-muted/10 hover:bg-primary/5 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-2.5 shadow-2xs">
                        <UploadCloud size={24} />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {t('marketing.dragOrUpload', 'Click or drag and drop image here')}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1">
                        {t('marketing.imageFormatHint', 'Supports PNG, JPG, WEBP, SVG (Max 5MB)')}
                      </span>
                    </label>
                  )
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      {t('marketing.imageUrl', 'Image URL')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/banner-image.jpg"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                )}

                {/* Target Link URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">
                    {t('marketing.targetLink', 'Destination Link')}
                  </label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder={t('marketing.targetLinkPlaceholder', 'https://example.com/promo-target')}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN: Placement, Settings & Live Preview (5/4 cols)
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* Placement & Ordering Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <LayoutTemplate size={16} />
                </div>
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  {t('marketing.bannerPlacementSection', 'Placement & Display Settings')}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Position Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">
                    {t('marketing.position', 'Placement Position')}
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="hero">{t('marketing.posHeroOption', 'Hero Banner')}</option>
                    <option value="sidebar">{t('marketing.posSidebarOption', 'Sidebar Banner')}</option>
                    <option value="popup">{t('marketing.posPopupOption', 'Popup Banner')}</option>
                    <option value="footer">{t('marketing.posFooterOption', 'Footer Banner')}</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">
                    {t('marketing.sortOrder', 'Sort Order')}
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Schedule & Active Status Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Calendar size={16} />
                </div>
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  {t('marketing.scheduleAndStatus', 'Schedule & Status')}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Starts At & Ends At */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      {t('marketing.startsAt', 'Start Date')}
                    </label>
                    <input
                      type="date"
                      value={startsAt}
                      onChange={(e) => setStartsAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      {t('marketing.endsAt', 'End Date')}
                    </label>
                    <input
                      type="date"
                      value={endsAt}
                      onChange={(e) => setEndsAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Active Status Switch */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {t('marketing.activeStatus', 'Publish Status')}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {isActive
                        ? t('marketing.bannerVisibleNotice', 'Banner will be visible on the storefront')
                        : t('marketing.bannerHiddenNotice', 'Banner will be temporarily hidden')}
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Storefront Preview Widget Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Eye size={16} />
                  </div>
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    {t('marketing.livePreview', 'Live Preview')}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase font-bold">
                  {position}
                </span>
              </div>

              {/* Banner Simulation Box */}
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-xs aspect-[16/9] bg-slate-950 flex flex-col justify-end p-4 text-white">
                {imageUrl ? (
                  <img
                    src={resolveDisplayImage(imageUrl)}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/logo.png'
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center text-slate-500 gap-2">
                    <ImageIcon size={32} className="opacity-40" />
                    <span className="text-xs font-bold text-slate-400">{t('marketing.noImageSelected', 'No image selected')}</span>
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary text-white shadow-2xs">
                        {badge}
                      </span>
                    )}
                    {discountTag && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-2xs">
                        {discountTag}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white leading-tight line-clamp-1">
                    {title || t('marketing.sampleBannerTitle', 'Sample Banner Title')}
                  </h4>

                  {subtitle && (
                    <p className="text-[11px] text-slate-300 line-clamp-1 leading-snug">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ─── Global Form Footer ─── */}
        <FormFooter
          onCancel={() => navigate(backPath)}
          cancelLabel={t('common.cancel', 'Cancel')}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          submitLabel={
            isEdit
              ? t('marketing.saveChanges', 'Save Changes')
              : t('marketing.saveBanner', 'Save Banner')
          }
          showShortcutHint={false}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  )
}

export default BannerFormPage
