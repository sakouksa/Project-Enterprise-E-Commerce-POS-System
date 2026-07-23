import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container-site py-12 space-y-12">
      <div className="max-w-xl mx-auto text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
          Contact Us
        </h1>
        <p className="text-xs text-gray-500">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="card p-5 flex items-center gap-4">
            <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-gray-900 dark:text-white">Head Office</div>
              <div className="text-gray-500">Phnom Penh, Cambodia</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-4">
            <Phone className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-gray-900 dark:text-white">Customer Support</div>
              <div className="text-gray-500">+855 12 345 6789</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-4">
            <Mail className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-gray-900 dark:text-white">Email Address</div>
              <div className="text-gray-500">support@shopkh.com</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          {submitted ? (
            <div className="p-6 text-center text-emerald-600 text-sm font-bold">
              Thank you! Your message has been sent. Our team will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Your Name *</label>
                  <input type="text" required className="input" placeholder="Sok Dara" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email Address *</label>
                  <input type="email" required className="input" placeholder="dara@example.com" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Subject</label>
                <input type="text" className="input" placeholder="Order inquiry, partnership, etc." />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Message *</label>
                <textarea required rows={4} className="input" placeholder="How can we help you?" />
              </div>

              <button type="submit" className="btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactPage
