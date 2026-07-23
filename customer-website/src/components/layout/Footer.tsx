import React from 'react'
import { Link } from 'react-router-dom'
import {
  Phone, Mail, MapPin, Send, ShieldCheck, Truck, RefreshCw, Headset,
  CreditCard, Globe, MessageSquare, Share2
} from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm mt-auto border-t border-gray-800">
      {/* ── Features Banner ────────────────────────────────────────────── */}
      <div className="border-b border-gray-800 py-8 bg-gray-950/50">
        <div className="container-site grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Free Fast Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">Free shipping on orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Secure Payment</h4>
              <p className="text-xs text-gray-500 mt-0.5">ABA KHQR, Visa, MasterCard</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Easy 30-Day Returns</h4>
              <p className="text-xs text-gray-500 mt-0.5">Money back guarantee policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-500 flex items-center justify-center flex-shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">24/7 Customer Support</h4>
              <p className="text-xs text-gray-500 mt-0.5">Dedicated live chat & call</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Links ────────────────────────────────────────────────── */}
      <div className="container-site py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="font-bold text-2xl text-white font-display">ShopKh</span>
          </Link>
          <p className="text-sm text-gray-400 max-w-sm">
            Enterprise E-Commerce & POS platform providing seamless shopping experience, genuine high-quality products, and fast nationwide delivery.
          </p>
          <div className="space-y-2 text-xs pt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Phnom Penh, Kingdom of Cambodia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>+855 12 345 6789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>support@shopkh.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4 font-display text-base">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/products?sort=deals" className="hover:text-white transition-colors">Today's Deals</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Latest News</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-semibold text-white mb-4 font-display text-base">Customer Care</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
            <li><Link to="/account/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ & Help</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white font-display text-base">Newsletter</h4>
          <p className="text-xs text-gray-400">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs w-full focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="btn-primary p-2 text-xs rounded-xl flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
          {/* Social Links */}
          <div className="flex items-center gap-2 pt-2">
            <a href="#" className="p-2 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors" title="Global Community">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white transition-colors" title="Telegram / WhatsApp">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-gray-800 hover:bg-blue-400 text-gray-300 hover:text-white transition-colors" title="Share Store">
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800 py-6">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Enterprise E-Commerce POS Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 font-bold">ABA KHQR</span>
            <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 font-bold">ACLEDA</span>
            <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 font-bold">VISA</span>
            <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 font-bold">MASTER</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
