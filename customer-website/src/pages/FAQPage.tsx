import React from 'react'
import PageTransition from '@/components/common/PageTransition'

const FAQPage: React.FC = () => {
  const faqs = [
    { q: 'How long does shipping take?', a: 'Standard delivery takes 1-2 business days within Phnom Penh and 2-3 days for other provinces. Express 3-hour delivery is available in Phnom Penh.' },
    { q: 'What payment methods are supported?', a: 'We support ABA KHQR, ACLEDA mobile, Visa/Mastercard credit cards, and Cash on Delivery (COD).' },
    { q: 'What is your return & refund policy?', a: 'You can return any unopened item within 30 days of purchase for a full refund or exchange.' },
    { q: 'Are all products authentic?', a: 'Yes! 100% of products sold on ShopKh are authentic and backed by manufacturer warranties.' },
  ]

  return (
    <PageTransition className="container-site py-12 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-gray-500">Find quick answers to common questions about orders, payments, and delivery.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="card p-5 space-y-2">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">{faq.q}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}

export default FAQPage
