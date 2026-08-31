import api from '@/api/client'

export const cmsService = {
  // CMS Dashboard Stats
  getStats: () =>
    api.get('/cms/stats').then(r => r.data.data),

  // Blogs
  getBlogs: (params: Record<string, any> = {}) =>
    api.get('/blogs', { params }).then(r => r.data),

  getBlog: (id: number) =>
    api.get(`/blogs/${id}`).then(r => r.data.data || r.data),

  createBlog: (data: any) =>
    api.post('/blogs', data).then(r => r.data.data || r.data),

  updateBlog: (id: number, data: any) =>
    api.put(`/blogs/${id}`, data).then(r => r.data.data || r.data),

  deleteBlog: (id: number) =>
    api.delete(`/blogs/${id}`).then(r => r.data),

  // Blog Categories
  getCategories: (params: Record<string, any> = {}) =>
    api.get('/blog-categories', { params }).then(r => r.data.data ?? r.data),

  getCategory: (id: number) =>
    api.get(`/blog-categories/${id}`).then(r => r.data.data),

  createCategory: (payload: any) =>
    api.post('/blog-categories', payload).then(r => r.data.data),

  updateCategory: (id: number, payload: any) =>
    api.put(`/blog-categories/${id}`, payload).then(r => r.data.data),

  deleteCategory: (id: number) =>
    api.delete(`/blog-categories/${id}`).then(r => r.data),

  // Dynamic Tab CRUD (ContentManagementPage)
  getItemsByTab: (tab: string, params: Record<string, any> = {}) =>
    api.get(`/${tab}`, { params }).then(r => r.data),

  createItemByTab: (tab: string, payload: any) =>
    api.post(`/${tab}`, payload).then(r => r.data.data || r.data),

  updateItemByTab: (tab: string, id: number, payload: any) =>
    api.put(`/${tab}/${id}`, payload).then(r => r.data.data || r.data),

  deleteItemByTab: (tab: string, id: number) =>
    api.delete(`/${tab}/${id}`).then(r => r.data),

  bulkDeleteItemsByTab: (tab: string, ids: number[]) =>
    api.post(`/${tab}/bulk-delete`, { ids }).then(r => r.data),
}

export default cmsService
