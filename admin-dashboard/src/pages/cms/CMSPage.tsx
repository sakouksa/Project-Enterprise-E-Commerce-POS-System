import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, X, Loader2, 
  FileText, FolderOpen, Tag, HelpCircle, File, Image
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import BannersPage from '@/pages/marketing/BannersPage'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

type Tab = 'blogs' | 'blog-categories' | 'blog-tags' | 'pages' | 'faqs' | 'banners'

const CMSPage: React.FC = () => {
  const qc = useQueryClient()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'blogs'
  const setActiveTab = (tab: Tab) => setSearchParams({ tab })

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: `cms_${activeTab}` })

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  
  // Entity states
  const [editingItem, setEditingItem] = useState<any>(null)

  // Common fields
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState('active')
  const [description, setDescription] = useState('')
  
  // FAQ fields
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [faqCategory, setFaqCategory] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)

  // Blog fields
  const [categoryId, setCategoryId] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  // API List
  const { data: listData, isLoading, isFetching } = useQuery({
    queryKey: [activeTab, page, debouncedSearch, perPage],
    queryFn: () => api.get(`/${activeTab}`, { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab !== 'banners',
  })

  // Helper Lists
  const { data: categories } = useQuery({
    queryKey: ['blog-categories-list'],
    queryFn: () => api.get('/blog-categories', { params: { per_page: 100 } }).then(r => r.data.data),
    enabled: activeTab === 'blogs',
  })

  const records = listData?.data ?? []
  const pagination = listData?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post(`/${activeTab}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      closeModal()
      toast.success('Created successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create item.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/${activeTab}/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      closeModal()
      toast.success('Updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update item.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/${activeTab}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      setConfirmOpen(false)
      toast.success('Deleted successfully.')
      adjustAfterDelete(records.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete item.')
      setConfirmOpen(false)
    }
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setName('')
    setSlug('')
    setContent('')
    setExcerpt('')
    setStatus('published')
    setDescription('')
    setQuestion('')
    setAnswer('')
    setFaqCategory('')
    setSortOrder('0')
    setIsActive(true)
    setCategoryId('')
    setMetaTitle('')
    setMetaDescription('')
    setModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    setTitle(item.title ?? '')
    setName(item.name ?? '')
    setSlug(item.slug ?? '')
    setContent(item.content ?? '')
    setExcerpt(item.excerpt ?? '')
    setStatus(item.status ?? 'published')
    setDescription(item.description ?? '')
    setQuestion(item.question ?? '')
    setAnswer(item.answer ?? '')
    setFaqCategory(item.category ?? '')
    setSortOrder(item.sort_order?.toString() ?? '0')
    setIsActive(item.is_active ?? true)
    setCategoryId(item.blog_category_id ?? '')
    setMetaTitle(item.meta_title ?? '')
    setMetaDescription(item.meta_description ?? '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let payload: any = {}
    if (activeTab === 'blog-categories') {
      payload = { company_id: 1, name, slug: slug || name.toLowerCase().replace(/ /g, '-'), description, is_active: isActive ? 1 : 0 }
    } else if (activeTab === 'blog-tags') {
      payload = { company_id: 1, name, slug: slug || name.toLowerCase().replace(/ /g, '-') }
    } else if (activeTab === 'blogs') {
      payload = {
        company_id: 1, blog_category_id: Number(categoryId), title, slug: slug || title.toLowerCase().replace(/ /g, '-'),
        excerpt, content, status, meta_title: metaTitle, meta_description: metaDescription
      }
    } else if (activeTab === 'pages') {
      payload = {
        company_id: 1, title, slug: slug || title.toLowerCase().replace(/ /g, '-'),
        content, status, meta_title: metaTitle, meta_description: metaDescription
      }
    } else if (activeTab === 'faqs') {
      payload = { company_id: 1, question, answer, category: faqCategory, sort_order: Number(sortOrder), is_active: isActive ? 1 : 0 }
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  const tabsList: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'blogs', label: 'Blogs', icon: <FileText size={16} /> },
    { id: 'blog-categories', label: 'Categories', icon: <FolderOpen size={16} /> },
    { id: 'blog-tags', label: 'Tags', icon: <Tag size={16} /> },
    { id: 'pages', label: 'Pages', icon: <File size={16} /> },
    { id: 'faqs', label: 'FAQs', icon: <HelpCircle size={16} /> },
    { id: 'banners', label: 'Banners', icon: <Image size={16} /> },
  ]

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'CMS' }]} />
      
      <PageHeader 
        title="Content Management (CMS)" 
        subtitle="Manage public blogs, custom pages, tags, categories, and FAQs"
        action={
          <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} /> Add New
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        {tabsList.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); reset(); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'banners' ? (
        <BannersPage isTab />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-lg border border-border">
            <SearchInput value={search} onChange={setSearch} placeholder="Search here..." />
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button onClick={() => qc.invalidateQueries({ queryKey: [activeTab] })} className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto">
                <RefreshCw size={16} /> Refresh
              </button>
              <ResetButton onClick={reset} />
            </div>
          </div>

          {/* Data Table */}
          <TableWrapper isFetching={isFetching}>
            <table className="w-full data-table">
              <thead>
                {activeTab === 'blogs' && (
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'blog-categories' && (
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'blog-tags' && (
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'pages' && (
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'faqs' && (
                  <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Category</th>
                    <th>Sort Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {isLoading ? (
                  <LoadingSkeleton cols={activeTab === 'faqs' ? 6 : activeTab === 'blog-tags' ? 4 : 5} />
                ) : records.length === 0 ? (
                  <EmptyState cols={activeTab === 'faqs' ? 6 : activeTab === 'blog-tags' ? 4 : 5} message="No records found" />
                ) : (
                  records.map((r: any) => (
                    <tr key={r.id}>
                      {activeTab === 'blogs' && (
                        <>
                          <td>{r.id}</td>
                          <td className="font-semibold text-foreground">{r.title}</td>
                          <td>{r.slug}</td>
                          <td>{r.category?.name ?? 'N/A'}</td>
                          <td>
                            <span className={`badge ${r.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                              {r.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === 'blog-categories' && (
                        <>
                          <td>{r.id}</td>
                          <td className="font-semibold text-foreground">{r.name}</td>
                          <td>{r.slug}</td>
                          <td>
                            <span className={`badge ${r.is_active ? 'badge-success' : 'badge-muted'}`}>
                              {r.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === 'blog-tags' && (
                        <>
                          <td>{r.id}</td>
                          <td className="font-semibold text-foreground">{r.name}</td>
                          <td>{r.slug}</td>
                        </>
                      )}
                      {activeTab === 'pages' && (
                        <>
                          <td>{r.id}</td>
                          <td className="font-semibold text-foreground">{r.title}</td>
                          <td>{r.slug}</td>
                          <td>
                            <span className={`badge ${r.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                              {r.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === 'faqs' && (
                        <>
                          <td>{r.id}</td>
                          <td className="font-semibold text-foreground">{r.question}</td>
                          <td>{r.category}</td>
                          <td>{r.sort_order}</td>
                          <td>
                            <span className={`badge ${r.is_active ? 'badge-success' : 'badge-muted'}`}>
                              {r.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </>
                      )}
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(r)} className="btn btn-icon btn-secondary" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => confirmDelete(r.id)} className="btn btn-icon btn-danger" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableWrapper>

          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      {/* CRUD Modal Form */}
      <AnimatePresence>
        {modalOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-md w-full">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-lg font-bold text-foreground">
                  {editingItem ? 'Edit CMS Item' : 'Add CMS Item'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {(activeTab === 'blog-categories' || activeTab === 'blog-tags') && (
                  <>
                    <div>
                      <label className="label">Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Slug (Optional)</label>
                      <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="input w-full" />
                    </div>
                    {activeTab === 'blog-categories' && (
                      <>
                        <div>
                          <label className="label">Description</label>
                          <textarea value={description} onChange={e => setDescription(e.target.value)} className="input w-full min-h-[80px]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                          <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                        </div>
                      </>
                    )}
                  </>
                )}

                {activeTab === 'blogs' && (
                  <>
                    <div>
                      <label className="label">Blog Title</label>
                      <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Category</label>
                      <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input w-full">
                        <option value="">Select Category</option>
                        {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Excerpt</label>
                      <textarea required value={excerpt} onChange={e => setExcerpt(e.target.value)} className="input w-full min-h-[60px]" />
                    </div>
                    <div>
                      <label className="label">Content (HTML or Markdown)</label>
                      <textarea required value={content} onChange={e => setContent(e.target.value)} className="input w-full min-h-[120px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Meta Title</label>
                        <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="input w-full">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'pages' && (
                  <>
                    <div>
                      <label className="label">Page Title</label>
                      <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Slug (Optional)</label>
                      <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Content</label>
                      <textarea required value={content} onChange={e => setContent(e.target.value)} className="input w-full min-h-[140px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Meta Title</label>
                        <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="input w-full">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'faqs' && (
                  <>
                    <div>
                      <label className="label">FAQ Category</label>
                      <input type="text" required placeholder="e.g. General, Shipping, Returns" value={faqCategory} onChange={e => setFaqCategory(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Question</label>
                      <input type="text" required value={question} onChange={e => setQuestion(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Answer</label>
                      <textarea required value={answer} onChange={e => setAnswer(e.target.value)} className="input w-full min-h-[100px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Sort Order</label>
                        <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="input w-full" />
                      </div>
                      <div className="flex items-center gap-2 mt-7">
                        <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                        <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn btn-primary flex items-center gap-2">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={16} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        open={confirmOpen} 
        onCancel={() => setConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Are you sure you want to delete this item?"
      />
    </div>
  )
}

export default CMSPage
