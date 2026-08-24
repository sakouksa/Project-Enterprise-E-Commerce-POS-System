import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import PageTransition from '@/components/common/PageTransition'

const BlogPage: React.FC = () => {
  const [blogs, setBlogs]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blog')
      .then(({ data }) => setBlogs(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <PageTransition className="container-site py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
          Latest News & Tech Articles
        </h1>
        <p className="text-xs text-gray-500 mt-1">Product guides, technology reviews, and store updates</p>
      </div>

      {blogs.length === 0 ? (
        <div className="card p-12 text-center text-xs text-gray-500">No blog posts available right now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Link key={b.id} to={`/blog/${b.slug}`} className="card-hover overflow-hidden flex flex-col">
              {b.thumbnail && <img src={b.thumbnail} alt={b.title} className="w-full h-48 object-cover" />}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[10px] font-bold uppercase text-blue-600 mb-1">{b.category}</div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2">{b.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-3 mt-1">{b.excerpt}</p>
                </div>
                <div className="text-[10px] text-gray-400">{new Date(b.published_at).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageTransition>
  )
}

export default BlogPage
