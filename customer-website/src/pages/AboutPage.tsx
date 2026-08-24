import React from 'react'
import { ShieldCheck, Award, Truck } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'

const AboutPage: React.FC = () => {
  return (
    <PageTransition className="container-site py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-display">
          About ShopKh Enterprise Platform
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
          We are the leading modern e-commerce and POS platform delivering top quality electronics, fashion, and home goods across Cambodia and Southeast Asia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">100% Authentic Products</h3>
          <p className="text-xs text-gray-500">Sourced directly from authorized manufacturers and official distributors.</p>
        </div>

        <div className="card p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Nationwide Fast Express</h3>
          <p className="text-xs text-gray-500">Same-day delivery in Phnom Penh and 1-2 day shipping across all 25 provinces.</p>
        </div>

        <div className="card p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Award-Winning Service</h3>
          <p className="text-xs text-gray-500">Trusted by over 100,000+ active happy customers nationwide.</p>
        </div>
      </div>
    </PageTransition>
  )
}

export default AboutPage
