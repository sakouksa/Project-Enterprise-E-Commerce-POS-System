export type Tab = 'blogs' | 'blog-categories' | 'blog-tags' | 'pages' | 'faqs' | 'banners'

export interface BlogPost {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  status: 'published' | 'draft' | 'archived' | 'pending'
  featured_image?: string
  category_id?: number
  category_name?: string
  author_name?: string
  views_count?: number
  created_at?: string
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  description?: string
  posts_count?: number
  is_active: boolean
}

export interface BlogTag {
  id: number
  name: string
  slug: string
  posts_count?: number
}

export interface CmsPage {
  id: number
  title: string
  slug: string
  content?: string
  status: 'published' | 'draft'
  views_count?: number
  created_at?: string
}

export interface FaqItem {
  id: number
  question: string
  answer: string
  category?: string
  sort_order?: number
  is_active: boolean
}

export interface CMSAnalytics {
  totalContent: number
  publishedCount: number
  draftCount: number
  archivedCount: number
  publishedToday: number
  totalViews: number
  avgReadTimeMin: number
  seoHealthScore: number
}
