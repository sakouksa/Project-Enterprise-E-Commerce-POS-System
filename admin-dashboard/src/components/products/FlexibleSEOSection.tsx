import React, { useState, useMemo } from 'react'
import {
  Globe,
  Search,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Eye,
  Save,
  Loader2,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  Monitor,
  ShieldCheck,
  X,
  Plus,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FlexibleSEOSectionProps {
  productName: string
  productSlug?: string
  metaTitle: string
  metaKeywords: string
  metaDescription: string
  productImage?: string
  categoryName?: string
  brandName?: string
  shortDescription?: string
  onMetaTitleChange: (val: string) => void
  onMetaKeywordsChange: (val: string) => void
  onMetaDescriptionChange: (val: string) => void
  onSlugChange?: (val: string) => void
  onSave?: () => void
  isSaving?: boolean
}

export const FlexibleSEOSection: React.FC<FlexibleSEOSectionProps> = ({
  productName,
  productSlug = '',
  metaTitle,
  metaKeywords,
  metaDescription,
  productImage,
  categoryName,
  brandName,
  shortDescription,
  onMetaTitleChange,
  onMetaKeywordsChange,
  onMetaDescriptionChange,
  onSlugChange,
  onSave,
  isSaving = false,
}) => {
  const { t } = useTranslation(['products', 'common'])

  // Local States
  const [previewTab, setPreviewTab] = useState<'serp' | 'social'>('serp')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [allowIndexing, setAllowIndexing] = useState(true)
  const [includeSitemap, setIncludeSitemap] = useState(true)
  const [keywordInput, setKeywordInput] = useState('')

  // Derived Title & Description for Preview
  const displayTitle = metaTitle || productName || 'Product Title'
  const displayDesc =
    metaDescription ||
    shortDescription ||
    `Buy official ${productName || 'product'} with fast delivery, authentic enterprise specifications, and store warranty.`
  
  // Format Slug
  const formattedSlug = useMemo(() => {
    if (productSlug) return productSlug
    return (productName || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }, [productSlug, productName])

  const canonicalUrl = `https://yourstore.com/products/${formattedSlug || 'product-slug'}`

  // Parse Keywords to Array
  const keywordTags = useMemo(() => {
    if (!metaKeywords) return []
    return metaKeywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
  }, [metaKeywords])

  // SEO Health Audit Calculation
  const seoAudit = useMemo(() => {
    let score = 0
    const titleLen = (metaTitle || productName || '').length
    const descLen = (metaDescription || '').length

    // Title Score (Max 30)
    if (titleLen >= 30 && titleLen <= 60) score += 30
    else if (titleLen > 0) score += 15

    // Description Score (Max 35)
    if (descLen >= 70 && descLen <= 160) score += 35
    else if (descLen > 0) score += 20

    // Keywords Score (Max 20)
    if (keywordTags.length >= 3) score += 20
    else if (keywordTags.length > 0) score += 10

    // Slug Score (Max 15)
    if (formattedSlug) score += 15

    return Math.min(100, score)
  }, [metaTitle, productName, metaDescription, keywordTags, formattedSlug])

  // Helpers
  const handleAutoGenerateTitle = () => {
    const generated = `${productName || 'Product'} | Enterprise POS Store`
    onMetaTitleChange(generated)
  }

  const handleAutoSlug = () => {
    if (!onSlugChange) return
    const slug = (productName || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    onSlugChange(slug)
  }

  const handleAutoSummarizeDesc = () => {
    const summary = shortDescription
      ? `${shortDescription} Buy online with fast delivery, authentic warranty, and enterprise POS reliability.`
      : `Official ${productName || 'product'} catalog specifications. High performance, verified enterprise quality, and warranty guaranteed.`
    onMetaDescriptionChange(summary.substring(0, 160))
  }

  const handleAddKeywordTag = (tagText: string) => {
    const trimmed = tagText.trim().toLowerCase()
    if (!trimmed) return
    if (!keywordTags.includes(trimmed)) {
      const nextTags = [...keywordTags, trimmed]
      onMetaKeywordsChange(nextTags.join(', '))
    }
    setKeywordInput('')
  }

  const handleRemoveKeywordTag = (tagToRemove: string) => {
    const nextTags = keywordTags.filter((t) => t !== tagToRemove)
    onMetaKeywordsChange(nextTags.join(', '))
  }

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddKeywordTag(keywordInput)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(canonicalUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  // Preset tag suggestions
  const suggestedTags = useMemo(() => {
    const set = new Set<string>()
    if (brandName) set.add(brandName.toLowerCase())
    if (categoryName) set.add(categoryName.toLowerCase())
    set.add('tech')
    set.add('enterprise')
    set.add('pos')
    set.add('store')
    return Array.from(set).filter((t) => !keywordTags.includes(t))
  }, [brandName, categoryName, keywordTags])

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP METRIC CARDS HEADER (SEO HEALTH & LENGTH CHARS) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall SEO Health Score */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('products.seoScoreLabel', 'SEO Health Score')}
            </span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black font-mono tracking-tight ${
                seoAudit >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : seoAudit >= 50
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {seoAudit}/100
            </span>
          </div>
          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                seoAudit >= 80
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              {seoAudit >= 80 ? (
                <>
                  <CheckCircle2 size={13} /> {t('products.seoScoreOptimal', 'Excellent SEO Setup')}
                </>
              ) : (
                <>
                  <AlertTriangle size={13} /> {t('products.seoScoreNeedsWork', 'Needs Optimization')}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Metric 2: Meta Title Health */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('products.metaTitleHealth', 'Meta Title Length')}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Search size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2.5xl font-black font-mono text-slate-900 dark:text-slate-100">
              {metaTitle.length}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              / 60 {t('products.charsCount', 'chars')}
            </span>
          </div>
          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                metaTitle.length >= 30 && metaTitle.length <= 60
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('products.optimalRange', { range: '30-60' })}
            </span>
          </div>
        </div>

        {/* Metric 3: Meta Description Health */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('products.metaDescHealth', 'Meta Description Length')}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Globe size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2.5xl font-black font-mono text-slate-900 dark:text-slate-100">
              {metaDescription.length}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              / 160 {t('products.charsCount', 'chars')}
            </span>
          </div>
          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                metaDescription.length >= 70 && metaDescription.length <= 160
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('products.optimalRange', { range: '70-160' })}
            </span>
          </div>
        </div>

        {/* Metric 4: Canonical URL Slug */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('products.canonicalUrlLabel', 'Canonical Slug URL')}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <LinkIcon size={16} />
            </div>
          </div>
          <div className="truncate text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            /{formattedSlug || 'slug'}
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              {copiedUrl ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copiedUrl ? t('products.copiedLink', 'Copied Link') : t('products.copyFullUrl', 'Copy Full URL')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. LIVE INTERACTIVE GOOGLE SEARCH SERP & SOCIAL PREVIEW CARD ─── */}
      <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t('products.serpPreviewTitle', 'Google Search SERP Preview')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('products.googleSearchNotice', 'This is how your product listing will appear in Google search results.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* SERP vs Social Card Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setPreviewTab('serp')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  previewTab === 'serp'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Search size={13} />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('social')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  previewTab === 'social'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Share2 size={13} />
                <span>Social Card</span>
              </button>
            </div>

            {/* Desktop vs Mobile Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Monitor size={14} className="inline mr-1" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone size={14} className="inline mr-1" /> Mobile
              </button>
            </div>
          </div>
        </div>

        {/* Live Card Render Container */}
        {previewTab === 'serp' ? (
          <div
            className={`mx-auto p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 transition-all ${
              previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'
            }`}
          >
            <div className="space-y-1.5">
              {/* Domain & Favicon Header */}
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-primary border border-primary/20">
                  <Search size={12} />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 leading-none text-[12px]">
                    Enterprise Store
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {canonicalUrl}
                  </div>
                </div>
              </div>

              {/* Blue SERP Title */}
              <h4 className="text-base sm:text-lg font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug truncate">
                {displayTitle}
              </h4>

              {/* Snippet Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-normal">
                {displayDesc}
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xs transition-all ${
              previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-md'
            }`}
          >
            <div className="h-40 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden">
              {productImage ? (
                <img src={productImage} alt="Social OG Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Globe size={32} className="mx-auto text-slate-400 mb-1 opacity-50" />
                  <span className="text-xs text-slate-400 font-semibold">{t('products.socialThumbnail', 'Social Share Thumbnail')}</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-1 bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                YOURSTORE.COM
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {displayTitle}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {displayDesc}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. FORM INPUTS & SMART HELPERS ─── */}
      <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Meta Title Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('products.metaTitleField', 'SEO Meta Title')}
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateTitle}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Wand2 size={12} />
                {t('products.autoGenerate')}
              </button>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder={t('products.metaTitlePlaceholder', 'SEO Search Engine Title...')}
              className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>

          {/* Meta Slug Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('products.urlSlugLabel', 'Product URL Slug (Permalink)')}
              </label>
              {onSlugChange && (
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  {t('products.autoGenerate')}
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                /products/
              </span>
              <input
                type="text"
                value={formattedSlug}
                onChange={(e) => onSlugChange && onSlugChange(e.target.value)}
                placeholder="product-url-slug"
                className="w-full h-10 pl-7 pr-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Meta Keywords Pill Tag Manager */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              {t('products.colKeywords', 'SEO Keywords & Search Tags')}
            </label>

            {keywordTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                {keywordTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold font-sans"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeywordTag(tag)}
                      className="hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative flex items-center">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder={t('products.addKeywordPlaceholder', 'Type keyword and press Enter or comma...')}
                className="w-full h-10 px-3.5 pr-10 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => handleAddKeywordTag(keywordInput)}
                className="absolute right-2 p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Quick Tag Ideas */}
            {suggestedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                  {t('products.suggestedTags', 'Quick Tag Suggestions:')}
                </span>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddKeywordTag(tag)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary border border-slate-200 dark:border-slate-700 text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Meta Description Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('products.colMetaDesc', 'Search Engine Meta Description')}
              </label>
              <button
                type="button"
                onClick={handleAutoSummarizeDesc}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={12} />
                {t('products.autoSummarize', 'Auto Summarize')}
              </button>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder={t('products.metaDescPlaceholder', 'Brief 150-character summary for Google search snippet...')}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
            />
          </div>
        </div>

        {/* Indexing Preferences */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowIndexing}
              onChange={(e) => setAllowIndexing(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {t('products.allowSearchIndexing', 'Allow Search Engine Indexing (index, follow)')}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSitemap}
              onChange={(e) => setIncludeSitemap(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t('products.includeSitemap', 'Include Product Page in XML Sitemap')}
            </span>
          </label>
        </div>
      </div>

      {/* ─── 4. BOTTOM ACTION BAR ─── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="px-6 py-2.5 bg-gradient-primary text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>{t('products.saveSeoDetails', 'រក្សាទុកព័ត៌មាន SEO')}</span>
        </button>
      </div>
    </div>
  )
}
