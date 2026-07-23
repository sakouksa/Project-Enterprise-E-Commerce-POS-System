import React from 'react'
import { Star } from 'lucide-react'

const ReviewsPage: React.FC = () => {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
        My Reviews
      </h2>
      <p className="text-xs text-gray-500">You haven't submitted any reviews yet.</p>
    </div>
  )
}

export default ReviewsPage
