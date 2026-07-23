import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams()

  return (
    <div className="container-site py-12 max-w-3xl mx-auto space-y-6">
      <Link to="/blog" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
      </Link>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display capitalize">
        {slug?.replace(/-/g, ' ')}
      </h1>
      <p className="text-xs text-gray-400">Published on {new Date().toLocaleDateString()}</p>
      <div className="card p-6 prose dark:prose-invert text-xs leading-relaxed text-gray-600 dark:text-gray-300">
        Article content loading...
      </div>
    </div>
  )
}

export default BlogDetailPage
