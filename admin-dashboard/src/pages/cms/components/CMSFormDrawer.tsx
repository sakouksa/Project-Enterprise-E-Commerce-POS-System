import React from 'react'
import FormDrawer from '@/components/common/FormDrawer'
import { Image, X } from 'lucide-react'
import type { Tab } from '../types'

interface CMSFormDrawerProps {
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

export const CMSFormDrawer: React.FC<CMSFormDrawerProps> = ({
  isOpen,
  onClose,
  editingItem,
  onSubmit,
  isSubmitting,
  activeTab,
  getAddButtonLabel,
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
  const drawerTitle = editingItem
    ? `Edit ${getAddButtonLabel().replace('Add ', '')}`
    : getAddButtonLabel()

  return (
    <FormDrawer
      open={isOpen}
      onClose={onClose}
      title={drawerTitle}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      {activeTab === 'blog-categories' && (
        <div className="space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Technology News"
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="technology-news"
              className="input w-full font-mono text-xs"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category overview & topic description..."
              className="input w-full min-h-[70px]"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="catActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="checkbox"
            />
            <label htmlFor="catActive" className="text-sm font-medium text-foreground cursor-pointer">
              Active Category
            </label>
          </div>
        </div>
      )}

      {activeTab === 'blog-tags' && (
        <div className="space-y-4">
          <div>
            <label className="label">Tag Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React, E-Commerce"
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="react-e-commerce"
              className="input w-full font-mono text-xs"
            />
          </div>
        </div>
      )}

      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div>
            <label className="label">Article Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog post headline..."
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-headline-slug"
              className="input w-full font-mono text-xs"
            />
          </div>
          <div>
            <label className="label">Blog Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input w-full"
            >
              <option value="">Uncategorized</option>
              {categoriesList.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Excerpt / Summary</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short introductory summary for card previews..."
              className="input w-full min-h-[60px]"
            />
          </div>
          <div>
            <label className="label">Full Article Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write full article body text..."
              className="input w-full min-h-[120px]"
            />
          </div>

          {/* Featured Cover Image */}
          <div>
            <label className="label">Featured Cover Image</label>
            {featuredImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-border group">
                <img src={featuredImage} alt="Cover Preview" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-muted/20 transition-colors">
                <Image size={24} className="text-muted-foreground mb-1" />
                <span className="text-xs font-semibold text-foreground">Click to upload cover photo</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label className="label">Publication Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-full">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div>
            <label className="label">Page Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Privacy Policy & Terms"
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="privacy-policy"
              className="input w-full font-mono text-xs"
            />
          </div>
          <div>
            <label className="label">Page Content HTML/Markdown</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter page body text..."
              className="input w-full min-h-[140px]"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-full">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div>
            <label className="label">Question *</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How do I track my order?"
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">Answer *</label>
            <textarea
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Detailed answer explanation..."
              className="input w-full min-h-[100px]"
            />
          </div>
          <div>
            <label className="label">FAQ Category</label>
            <input
              type="text"
              value={faqCategory}
              onChange={(e) => setFaqCategory(e.target.value)}
              placeholder="e.g. Shipping, Billing, Returns"
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="0"
              className="input w-full"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="faqActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="checkbox"
            />
            <label htmlFor="faqActive" className="text-sm font-medium text-foreground cursor-pointer">
              Active FAQ Entry
            </label>
          </div>
        </div>
      )}
    </FormDrawer>
  )
}

export default CMSFormDrawer
