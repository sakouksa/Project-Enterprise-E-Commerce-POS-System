import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Crosshair,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Globe,
  Sun,
  Moon,
  MapPin,
  Compass,
  Building,
  Store,
  Navigation,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'

// Google Maps Official Tile Layers with 5-Language metadata
const GOOGLE_MAP_LAYERS = [
  {
    id: 'google_streets',
    key: 'layerGoogleRoads',
    subKey: 'layerGoogleRoadsSub',
    fallbackName: 'Google Roads (Standard)',
    fallbackSub: 'Clear road names & locations',
    icon: MapPin,
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    maxZoom: 20,
    previewColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'google_hybrid',
    key: 'layerGoogleHybrid',
    subKey: 'layerGoogleHybridSub',
    fallbackName: 'Google Satellite (Hybrid)',
    fallbackSub: 'Satellite imagery + road labels',
    icon: Globe,
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Imagery',
    maxZoom: 20,
    previewColor: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'google_terrain',
    key: 'layerGoogleTerrain',
    subKey: 'layerGoogleTerrainSub',
    fallbackName: 'Google Terrain',
    fallbackSub: 'Elevation, hills & green areas',
    icon: Sun,
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain',
    maxZoom: 20,
    previewColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'dark_matter',
    key: 'layerDarkMode',
    subKey: 'layerDarkModeSub',
    fallbackName: 'Dark Mode',
    fallbackSub: 'Optimal for low-light conditions',
    icon: Moon,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    maxZoom: 19,
    previewColor: 'from-slate-700 to-slate-900',
  },
]

// Comprehensive Cambodian Administrative & Geographic Gazetteer
const CAMBODIA_GAZETTEER = [
  // ─── 25 PROVINCES & CAPITALS ───
  { nameKm: 'រាជធានីភ្នំពេញ', nameEn: 'Phnom Penh Capital', lat: 11.5564, lng: 104.9282, category: '🏛️ Capital', province: 'Phnom Penh' },
  { nameKm: 'ខេត្តកណ្តាល', nameEn: 'Kandal Province', lat: 11.4833, lng: 104.95, category: '🏛️ Province', province: 'Kandal' },
  { nameKm: 'ខេត្តសៀមរាប', nameEn: 'Siem Reap Province', lat: 13.3671, lng: 103.8448, category: '🏛️ Province', province: 'Siem Reap' },
  { nameKm: 'ខេត្តបាត់ដំបង', nameEn: 'Battambang Province', lat: 13.0957, lng: 103.2022, category: '🏛️ Province', province: 'Battambang' },
  { nameKm: 'ខេត្តព្រះសីហនុ', nameEn: 'Preah Sihanouk Province', lat: 10.6275, lng: 103.5221, category: '🏛️ Province', province: 'Preah Sihanouk' },
  { nameKm: 'ខេត្តកំពង់ធំ', nameEn: 'Kampong Thom Province', lat: 12.7111, lng: 104.8887, category: '🏛️ Province', province: 'Kampong Thom' },
  { nameKm: 'ខេត្តកំពង់ចាម', nameEn: 'Kampong Cham Province', lat: 11.9924, lng: 105.4645, category: '🏛️ Province', province: 'Kampong Cham' },
  { nameKm: 'ខេត្តកំពត', nameEn: 'Kampot Province', lat: 10.6104, lng: 104.1815, category: '🏛️ Province', province: 'Kampot' },
  { nameKm: 'ខេត្តកែប', nameEn: 'Kep Province', lat: 10.4829, lng: 104.3167, category: '🏛️ Province', province: 'Kep' },
  { nameKm: 'ខេត្តកំពង់ស្ពឺ', nameEn: 'Kampong Speu Province', lat: 11.4533, lng: 104.5209, category: '🏛️ Province', province: 'Kampong Speu' },
  { nameKm: 'ខេត្តកំពង់ឆ្នាំង', nameEn: 'Kampong Chhnang Province', lat: 12.25, lng: 104.6667, category: '🏛️ Province', province: 'Kampong Chhnang' },
  { nameKm: 'ខេត្តកោះកុង', nameEn: 'Koh Kong Province', lat: 11.6153, lng: 102.9838, category: '🏛️ Province', province: 'Koh Kong' },
  { nameKm: 'ខេត្តក្រចេះ', nameEn: 'Kratie Province', lat: 12.4881, lng: 106.0188, category: '🏛️ Province', province: 'Kratie' },
  { nameKm: 'ខេត្តមណ្ឌលគិរី', nameEn: 'Mondulkiri Province', lat: 12.4558, lng: 107.1881, category: '🏛️ Province', province: 'Mondulkiri' },
  { nameKm: 'ខេត្តរតនគិរី', nameEn: 'Ratanakiri Province', lat: 13.7317, lng: 107.0183, category: '🏛️ Province', province: 'Ratanakiri' },
  { nameKm: 'ខេត្តស្ទឹងត្រែង', nameEn: 'Stung Treng Province', lat: 13.5259, lng: 105.9683, category: '🏛️ Province', province: 'Stung Treng' },
  { nameKm: 'ខេត្តព្រះវិហារ', nameEn: 'Preah Vihear Province', lat: 13.8073, lng: 104.9815, category: '🏛️ Province', province: 'Preah Vihear' },
  { nameKm: 'ខេត្តបន្ទាយមានជ័យ', nameEn: 'Banteay Meanchey Province', lat: 13.5859, lng: 102.9737, category: '🏛️ Province', province: 'Banteay Meanchey' },
  { nameKm: 'ខេត្តឧត្តរមានជ័យ', nameEn: 'Oddar Meanchey Province', lat: 14.1818, lng: 103.5176, category: '🏛️ Province', province: 'Oddar Meanchey' },
  { nameKm: 'ខេត្តប៉ៃលិន', nameEn: 'Pailin Province', lat: 12.8489, lng: 102.6093, category: '🏛️ Province', province: 'Pailin' },
  { nameKm: 'ខេត្តពោធិ៍សាត់', nameEn: 'Pursat Province', lat: 12.5333, lng: 103.9167, category: '🏛️ Province', province: 'Pursat' },
  { nameKm: 'ខេត្តព្រៃវែង', nameEn: 'Prey Veng Province', lat: 11.4851, lng: 105.3265, category: '🏛️ Province', province: 'Prey Veng' },
  { nameKm: 'ខេត្តស្វាយរៀង', nameEn: 'Svay Rieng Province', lat: 11.0879, lng: 105.7993, category: '🏛️ Province', province: 'Svay Rieng' },
  { nameKm: 'ខេត្តតាកែវ', nameEn: 'Takeo Province', lat: 10.9908, lng: 104.7847, category: '🏛️ Province', province: 'Takeo' },
  { nameKm: 'ខេត្តត្បូងឃ្មុំ', nameEn: 'Tboung Khmum Province', lat: 11.8891, lng: 105.6598, category: '🏛️ Province', province: 'Tboung Khmum' },

  // ─── KHANS IN PHNOM PENH ───
  { nameKm: 'ខណ្ឌដូនពេញ', nameEn: 'Khan Doun Penh', lat: 11.5721, lng: 104.9254, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌចំការមន', nameEn: 'Khan Chamkarmon', lat: 11.5458, lng: 104.9312, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌទួលគោក', nameEn: 'Khan Tuol Kork', lat: 11.5739, lng: 104.8967, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌ៧មករា', nameEn: 'Khan 7 Makara', lat: 11.5623, lng: 104.9142, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌបឹងកេងកង', nameEn: 'Khan Boeng Keng Kang', lat: 11.5518, lng: 104.9248, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌសែនសុខ', nameEn: 'Khan Sen Sok', lat: 11.5901, lng: 104.8722, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌពោធិ៍សែនជ័យ', nameEn: 'Khan Pou Senchey', lat: 11.5452, lng: 104.8324, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌមានជ័យ', nameEn: 'Khan Mean Chey', lat: 11.5235, lng: 104.9087, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌឬស្សីកែវ', nameEn: 'Khan Russey Keo', lat: 11.6035, lng: 104.9102, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌជ្រោយចង្វារ', nameEn: 'Khan Chroy Changvar', lat: 11.6052, lng: 104.9387, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌច្បារអំពៅ', nameEn: 'Khan Chbar Ampov', lat: 11.5342, lng: 104.9542, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌដង្កោ', nameEn: 'Khan Dangkao', lat: 11.4921, lng: 104.8724, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌព្រែកព្នៅ', nameEn: 'Khan Prek Pnov', lat: 11.6512, lng: 104.8512, category: '🏙️ Khan', province: 'Phnom Penh' },
  { nameKm: 'ខណ្ឌកំបូល', nameEn: 'Khan Kamboul', lat: 11.5212, lng: 104.7745, category: '🏙️ Khan', province: 'Phnom Penh' },

  // ─── POPULAR SANGKATS ───
  { nameKm: 'សង្កាត់បឹងកេងកង១ (BKK1)', nameEn: 'Sangkat Boeng Keng Kang 1', lat: 11.5518, lng: 104.9248, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ទន្លេបាសាក់', nameEn: 'Sangkat Tonle Bassac', lat: 11.5489, lng: 104.9345, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ទួលទំពូង១', nameEn: 'Sangkat Tuol Toumpoung 1', lat: 11.5412, lng: 104.9125, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ទឹកល្អក់១', nameEn: 'Sangkat Tuek L\'ak 1', lat: 11.5689, lng: 104.8965, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ទឹកថ្លា', nameEn: 'Sangkat Tuek Thla', lat: 11.5612, lng: 104.8765, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ភ្នំពេញថ្មី', nameEn: 'Sangkat Phnom Penh Thmei', lat: 11.5845, lng: 104.8745, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់កាកាប១', nameEn: 'Sangkat Kakab 1', lat: 11.5512, lng: 104.8452, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ចោមចៅ១', nameEn: 'Sangkat Chaom Chau 1', lat: 11.5285, lng: 104.8412, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ច្បារអំពៅ១', nameEn: 'Sangkat Chbar Ampov 1', lat: 11.5412, lng: 104.9452, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ព្រែកប្រា', nameEn: 'Sangkat Prek Pra', lat: 11.5012, lng: 104.9685, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ព្រែកឯង', nameEn: 'Sangkat Prek Eng', lat: 11.5085, lng: 105.0012, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ទួលសង្កែ១', nameEn: 'Sangkat Tuol Sangke 1', lat: 11.5912, lng: 104.9015, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់បឹងកក់១', nameEn: 'Sangkat Boeng Kak 1', lat: 11.5795, lng: 104.9015, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ផ្សារថ្មី១', nameEn: 'Sangkat Phsar Thmei 1', lat: 11.5712, lng: 104.9245, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ផ្សារកណ្តាល១', nameEn: 'Sangkat Phsar Kandal 1', lat: 11.5685, lng: 104.9312, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ស្ទឹងមានជ័យ១', nameEn: 'Sangkat Stueng Mean Chey 1', lat: 11.5385, lng: 104.8875, category: '🏘️ Sangkat', province: 'Phnom Penh' },
  { nameKm: 'សង្កាត់ចាក់អង្រែលើ', nameEn: 'Sangkat Chak Angrae Leu', lat: 11.5245, lng: 104.9312, category: '🏘️ Sangkat', province: 'Phnom Penh' },

  // ─── POPULAR VILLAGES ───
  { nameKm: 'ភូមិបាយ៉ាប', nameEn: 'Phum Bayab', lat: 11.5895, lng: 104.8712, category: '🏡 Village', province: 'Phnom Penh (Sen Sok)' },
  { nameKm: 'ភូមិព្រៃទា', nameEn: 'Phum Prey Tea', lat: 11.5312, lng: 104.8345, category: '🏡 Village', province: 'Phnom Penh (Chaom Chau)' },
  { nameKm: 'ភូមិទ្រា', nameEn: 'Phum Trea', lat: 11.5295, lng: 104.8912, category: '🏡 Village', province: 'Phnom Penh (Mean Chey)' },
  { nameKm: 'ភូមិគោកចំបក់', nameEn: 'Phum Kork Chambak', lat: 11.5412, lng: 104.8512, category: '🏡 Village', province: 'Phnom Penh' },
  { nameKm: 'ភូមិកោះនរា', nameEn: 'Phum Koh Norea', lat: 11.5385, lng: 104.9485, category: '🏡 Village', province: 'Phnom Penh' },
  { nameKm: 'ភូមិព្រែកតាពៅ', nameEn: 'Phum Prek Ta Pov', lat: 11.4875, lng: 104.9512, category: '🏡 Village', province: 'Kandal (Ta Khmau)' },

  // ─── TEMPLES & LANDMARKS ───
  { nameKm: 'ប្រាសាទភ្នំបាខែង', nameEn: 'Phnom Bakheng Temple', lat: 13.4238, lng: 103.858, category: '🏛️ Temple', province: 'Siem Reap' },
  { nameKm: 'ប្រាសាទអង្គរវត្ត', nameEn: 'Angkor Wat Temple', lat: 13.4125, lng: 103.867, category: '🏛️ Temple', province: 'Siem Reap' },
  { nameKm: 'ប្រាសាទបាយ័ន', nameEn: 'Bayon Temple', lat: 13.4413, lng: 103.8587, category: '🏛️ Temple', province: 'Siem Reap' },
  { nameKm: 'ប្រាសាទតាព្រហ្ម', nameEn: 'Ta Prohm Temple', lat: 13.4348, lng: 103.8892, category: '🏛️ Temple', province: 'Siem Reap' },
  { nameKm: 'ប្រាសាទបន្ទាយស្រី', nameEn: 'Banteay Srei Temple', lat: 13.5989, lng: 103.963, category: '🏛️ Temple', province: 'Siem Reap' },
  { nameKm: 'ប្រាសាទព្រះវិហារ', nameEn: 'Preah Vihear Temple', lat: 14.3908, lng: 104.6803, category: '🏛️ Temple', province: 'Preah Vihear' },
  { nameKm: 'ប្រាសាទសំបូរព្រៃគុក', nameEn: 'Sambor Prei Kuk Temple', lat: 12.8712, lng: 105.0402, category: '🏛️ Temple', province: 'Kampong Thom' },
  { nameKm: 'រមណីយដ្ឋានវត្តភ្នំ', nameEn: 'Wat Phnom Historical Site', lat: 11.5762, lng: 104.923, category: '🏛️ Landmark', province: 'Phnom Penh' },
  { nameKm: 'ព្រះបរមរាជវាំង', nameEn: 'Royal Palace Phnom Penh', lat: 11.5638, lng: 104.9317, category: '👑 Royal Palace', province: 'Phnom Penh' },
  { nameKm: 'វិមានឯករាជ្យ', nameEn: 'Independence Monument', lat: 11.5564, lng: 104.9282, category: '🗽 Monument', province: 'Phnom Penh' },
  { nameKm: 'ផ្សារធំថ្មី', nameEn: 'Central Market (Phsar Thmey)', lat: 11.5696, lng: 104.9213, category: '🛒 Market', province: 'Phnom Penh' },
  { nameKm: 'ផ្សារទួលទំពូង', nameEn: 'Russian Market', lat: 11.5406, lng: 104.9149, category: '🛒 Market', province: 'Phnom Penh' },
  { nameKm: 'ផ្សារទំនើប អ៊ីអន ១', nameEn: 'AEON Mall Phnom Penh 1', lat: 11.5476, lng: 104.9358, category: '🏬 Shopping Mall', province: 'Phnom Penh' },
  { nameKm: 'ផ្សារទំនើប អ៊ីអន ២', nameEn: 'AEON Mall Sen Sok 2', lat: 11.5971, lng: 104.8847, category: '🏬 Shopping Mall', province: 'Phnom Penh' },
  { nameKm: 'ផ្សារទំនើប អ៊ីអន ៣', nameEn: 'AEON Mall Mean Chey 3', lat: 11.4988, lng: 104.9238, category: '🏬 Shopping Mall', province: 'Phnom Penh' },
  { nameKm: 'ទីក្រុងកោះពេជ្រ', nameEn: 'Koh Pich Diamond Island', lat: 11.5458, lng: 104.9392, category: '🏙️ Satellite City', province: 'Phnom Penh' },
  { nameKm: 'បុរី ប៉េង ហួត (បឹងស្នោ)', nameEn: 'Borey Peng Huoth Boeung Snor', lat: 11.5285, lng: 104.9652, category: '🏡 Borey', province: 'Phnom Penh' },
  { nameKm: 'បុរី ជីប ម៉ុង (សែនសុខ)', nameEn: 'Borey Chip Mong Sen Sok', lat: 11.5945, lng: 104.8785, category: '🏡 Borey', province: 'Phnom Penh' },
]

// Authentic Google Maps Red Droplet Marker with Pulse Shadow
const createGoogleMapsPinIcon = () => {
  return L.divIcon({
    className: 'google-maps-pin-container',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
        <!-- Pulsing Ground Radar Wave -->
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(234, 67, 53, 0.35); animation: gmap-pulse 2s infinite ease-out;"></div>
        
        <!-- Google Maps Drop Pin SVG -->
        <div style="position: absolute; bottom: 6px; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5)); transform-origin: bottom center; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.625 17 42 17 42C17 42 34 27.625 34 17C34 7.61116 26.3888 0 17 0Z" fill="#EA4335"/>
            <circle cx="17" cy="16" r="7" fill="white"/>
            <circle cx="17" cy="16" r="3.8" fill="#B91C1C"/>
          </svg>
        </div>
      </div>
      <style>
        @keyframes gmap-pulse {
          0% { transform: scale(0.3); opacity: 0.95; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 38],
    popupAnchor: [0, -38],
  })
}

// Clean administrative prefixes in Khmer to improve fuzzy search
const cleanKhmerAdministrativePrefixes = (raw: string): string => {
  return raw
    .replace(/^(រាជធានី|ខេត្ត|ក្រុង|ខណ្ឌ|ស្រុក|សង្កាត់|ឃុំ|ភូមិ|ប្រាសាទ|វត្ត|ផ្សារ|ផ្លូវ|មហាវិថី|បុរី)\s*/g, '')
    .trim()
}

interface MapLocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
  initialLat?: number | null
  initialLng?: number | null
  initialCity?: string
  initialAddress?: string
  onSelectLocation: (location: {
    latitude: number
    longitude: number
    address?: string
    city?: string
    province?: string
    postal_code?: string
  }) => void
}

export const MapLocationPickerModal: React.FC<MapLocationPickerModalProps> = ({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialCity,
  initialAddress,
  onSelectLocation,
}) => {
  const { t, i18n } = useTranslation(['customers', 'common'])
  const toast = useToast()
  const currentLang = i18n.language || 'en'
  const isKhmer = currentLang === 'km'

  const searchBoxRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const activeTileLayerRef = useRef<L.TileLayer | null>(null)

  // Resolve starting coordinates
  const resolveInitialCoords = () => {
    if (initialLat && initialLng && !isNaN(Number(initialLat)) && !isNaN(Number(initialLng))) {
      return { lat: Number(initialLat), lng: Number(initialLng) }
    }
    if (initialCity) {
      const match = CAMBODIA_GAZETTEER.find(
        (c) =>
          c.nameEn.toLowerCase().includes(initialCity.toLowerCase()) ||
          c.nameKm.includes(initialCity) ||
          initialCity.toLowerCase().includes(c.nameEn.toLowerCase())
      )
      if (match) return { lat: match.lat, lng: match.lng }
    }
    return { lat: 11.5564, lng: 104.9282 } // Phnom Penh Default
  }

  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number }>(resolveInitialCoords)
  const [resolvedAddress, setResolvedAddress] = useState<string>(initialAddress || '')
  const [resolvedCity, setResolvedCity] = useState<string>(initialCity || '')
  const [resolvedProvince, setResolvedProvince] = useState<string>('')
  const [resolvedPostalCode, setResolvedPostalCode] = useState<string>('')
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [currentLayerId, setCurrentLayerId] = useState<string>('google_streets')
  const [showLayerMenu, setShowLayerMenu] = useState(false)

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Switch Layer dynamically (like Google Maps)
  const switchLayer = (layerId: string) => {
    setCurrentLayerId(layerId)
    setShowLayerMenu(false)
    const layerDef = GOOGLE_MAP_LAYERS.find((l) => l.id === layerId) || GOOGLE_MAP_LAYERS[0]
    if (mapInstanceRef.current && layerDef) {
      if (activeTileLayerRef.current) {
        mapInstanceRef.current.removeLayer(activeTileLayerRef.current)
      }
      const newTileLayer = L.tileLayer(layerDef.url, {
        attribution: layerDef.attribution,
        maxZoom: layerDef.maxZoom,
      }).addTo(mapInstanceRef.current)
      activeTileLayerRef.current = newTileLayer
    }
  }

  // Reverse Geocoding with OpenStreetMap Nominatim
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsReverseGeocoding(true)
      try {
        const langHeader = isKhmer ? 'km,en' : `${currentLang},en`
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: { 'Accept-Language': langHeader },
          }
        )
        if (res.ok) {
          const data = await res.json()
          if (data && data.display_name) {
            setResolvedAddress(data.display_name)
            const addr = data.address || {}
            const city =
              addr.city ||
              addr.town ||
              addr.municipality ||
              addr.county ||
              addr.state_district ||
              addr.state ||
              ''
            const province = addr.state || addr.province || addr.state_district || ''
            const postcode = addr.postcode || ''
            if (city) setResolvedCity(city)
            if (province) setResolvedProvince(province)
            if (postcode) setResolvedPostalCode(postcode)
          }
        }
      } catch {
        // network silent fallback
      } finally {
        setIsReverseGeocoding(false)
      }
    },
    [isKhmer, currentLang]
  )

  // Move marker & Pan smoothly
  const panToLocation = useCallback(
    (lat: number, lng: number, zoomLevel = 17) => {
      setSelectedPos({ lat, lng })
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lng], zoomLevel, {
          duration: 1.1,
          easeLinearity: 0.25,
        })
      }
      reverseGeocode(lat, lng)
    },
    [reverseGeocode]
  )

  // Device GPS Locate (Ultra-resilient Multi-Tier: Real GPS -> Wi-Fi Geo -> Optional IP Fallback)
  const handleLocateMe = useCallback(
    (isAuto = false) => {
      setIsLocating(true)

      const onGeoSuccess = (lat: number, lng: number) => {
        setIsLocating(false)
        panToLocation(lat, lng, 18)
        toast.success(
          t('customers.gpsSuccess', '📍 Current location detected successfully!')
        )
      }

      const tryIpFallback = async (manualErrorReason?: string) => {
        // If auto-locating and we already have an initial city, do not force Phnom Penh IP fallback
        if (isAuto && initialCity) {
          setIsLocating(false)
          return
        }

        try {
          const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3500) })
          if (res.ok) {
            const data = await res.json()
            if (data && data.success && data.latitude && data.longitude) {
              onGeoSuccess(data.latitude, data.longitude)
              return
            }
          }
        } catch {
          // secondary fallback
          try {
            const res2 = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) })
            if (res2.ok) {
              const data2 = await res2.json()
              if (data2 && data2.latitude && data2.longitude) {
                onGeoSuccess(data2.latitude, data2.longitude)
                return
              }
            }
          } catch {
            // ignore
          }
        }

        setIsLocating(false)
        if (!isAuto && manualErrorReason) {
          toast.warning(manualErrorReason)
        }
      }

      if (!navigator.geolocation) {
        if (!isAuto) {
          tryIpFallback(
            t('customers.geolocationNotSupported', 'Geolocation is not supported by your browser')
          )
        } else {
          setIsLocating(false)
        }
        return
      }

      // Step 1: High Accuracy Hardware GPS
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onGeoSuccess(pos.coords.latitude, pos.coords.longitude)
        },
        (errHigh) => {
          // Step 2: Low Accuracy / Wi-Fi Cell positioning
          navigator.geolocation.getCurrentPosition(
            (posLow) => {
              onGeoSuccess(posLow.coords.latitude, posLow.coords.longitude)
            },
            () => {
              // If it's auto-locate on initial load, do not jump to Phnom Penh if user has city
              if (isAuto) {
                setIsLocating(false)
                return
              }

              // Step 3: IP Location fallback for manual click
              const errorReason =
                errHigh.code === errHigh.PERMISSION_DENIED
                  ? t('customers.gpsPermissionDenied', 'Location permission denied. Please allow location access in your browser settings.')
                  : t('customers.gpsUnavailable', 'GPS location is unavailable. Please check your connection or select your province above.')
              tryIpFallback(errorReason)
            },
            { enableHighAccuracy: false, timeout: 4000, maximumAge: 60000 }
          )
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    },
    [initialCity, panToLocation, t, toast]
  )

  // Initialize Map
  useEffect(() => {
    if (!isOpen) return

    const initialCoords = resolveInitialCoords()
    setSelectedPos(initialCoords)

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const map = L.map(mapContainerRef.current, {
        center: [initialCoords.lat, initialCoords.lng],
        zoom: initialLat && initialLng ? 16 : 14,
        zoomControl: false,
      })

      const initialLayerDef = GOOGLE_MAP_LAYERS.find((l) => l.id === currentLayerId) || GOOGLE_MAP_LAYERS[0]
      const tileLayer = L.tileLayer(initialLayerDef.url, {
        attribution: initialLayerDef.attribution,
        maxZoom: initialLayerDef.maxZoom,
      }).addTo(map)
      activeTileLayerRef.current = tileLayer

      // Google Maps Red Pin Marker
      const customIcon = createGoogleMapsPinIcon()
      const marker = L.marker([initialCoords.lat, initialCoords.lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        setSelectedPos({ lat: pos.lat, lng: pos.lng })
        reverseGeocode(pos.lat, pos.lng)
      })

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng)
        setSelectedPos({ lat: e.latlng.lat, lng: e.latlng.lng })
        reverseGeocode(e.latlng.lat, e.latlng.lng)
      })

      mapInstanceRef.current = map
      markerRef.current = marker

      reverseGeocode(initialCoords.lat, initialCoords.lng)

      setTimeout(() => {
        map.invalidateSize()
        if (!initialLat && !initialLng) {
          handleLocateMe(true)
        }
      }, 350)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isOpen, initialLat, initialLng, handleLocateMe])

  // Get default popular suggestions when search query is empty
  const defaultPopularSuggestions = useMemo(() => {
    return CAMBODIA_GAZETTEER.slice(0, 10).map((item) => ({
      display_name: `${isKhmer ? item.nameKm : item.nameEn}, ${item.province}, Cambodia`,
      name: isKhmer ? item.nameKm : item.nameEn,
      subname: `${isKhmer ? item.nameEn : item.nameKm} • ${item.province}`,
      category: item.category,
      lat: item.lat,
      lon: item.lng,
      isLocal: true,
    }))
  }, [isKhmer])

  // ─── Multi-Engine Intelligent Geocoder (5-Language Compatible) ───
  useEffect(() => {
    const rawQuery = searchQuery.trim()
    if (!rawQuery || rawQuery.length < 1) {
      setSearchResults(defaultPopularSuggestions)
      return
    }

    const query = rawQuery.toLowerCase()
    const cleanQuery = cleanKhmerAdministrativePrefixes(rawQuery).toLowerCase()

    // 1. Instant Match from Comprehensive Gazetteer
    const localMatches = CAMBODIA_GAZETTEER.filter((item) => {
      const nameKm = item.nameKm.toLowerCase()
      const nameEn = item.nameEn.toLowerCase()
      const province = item.province.toLowerCase()
      const cleanItem = cleanKhmerAdministrativePrefixes(item.nameKm).toLowerCase()

      const matchDirect = nameKm.includes(query) || nameEn.includes(query) || province.includes(query)
      const matchClean = cleanQuery.length > 1 && (cleanItem.includes(cleanQuery) || nameKm.includes(cleanQuery) || nameEn.includes(cleanQuery))

      return matchDirect || matchClean
    }).map((item) => ({
      display_name: `${isKhmer ? item.nameKm : item.nameEn}, ${item.province}, Cambodia`,
      name: isKhmer ? item.nameKm : item.nameEn,
      subname: `${isKhmer ? item.nameEn : item.nameKm} • ${item.province}`,
      category: item.category,
      lat: item.lat,
      lon: item.lng,
      isLocal: true,
    }))

    setSearchResults(localMatches)
    setShowSuggestions(true)

    // 2. High-Precision Asynchronous Multi-API Geocoding
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const searchTerms = [cleanQuery || query, query]
        const uniqueTerms = Array.from(new Set(searchTerms))

        const apiResults: any[] = []

        // A. Fast Photon API query
        for (const term of uniqueTerms) {
          try {
            const photonRes = await fetch(
              `https://photon.komoot.io/api/?q=${encodeURIComponent(
                term
              )}&lat=12.5657&lon=104.9910&limit=8`
            )
            if (photonRes.ok) {
              const data = await photonRes.json()
              if (data && data.features) {
                data.features.forEach((f: any) => {
                  const p = f.properties || {}
                  const title = p.name || p.street || p.city || term
                  const state = [p.district, p.city, p.state, p.country].filter(Boolean).join(', ')
                  apiResults.push({
                    display_name: `${title}, ${state}`,
                    name: title,
                    subname: state || 'Cambodia',
                    category: p.type === 'village' ? '🏡 Village' : p.type === 'administrative' ? '🏘️ Admin' : '📍 Place',
                    lat: f.geometry.coordinates[1],
                    lon: f.geometry.coordinates[0],
                    isLocal: false,
                  })
                })
              }
            }
          } catch {
            // silent fallback
          }
        }

        // B. Nominatim Cambodia Geocoder Fallback
        if (apiResults.length < 3) {
          try {
            const nomQuery = `${cleanQuery || query}, Cambodia`
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                nomQuery
              )}&countrycodes=kh&addressdetails=1&limit=6`,
              { headers: { 'Accept-Language': isKhmer ? 'km,en' : `${currentLang},en` } }
            )
            if (nomRes.ok) {
              const nomData = await nomRes.json()
              if (Array.isArray(nomData)) {
                nomData.forEach((item: any) => {
                  apiResults.push({
                    display_name: item.display_name,
                    name: item.display_name.split(',')[0],
                    subname: item.display_name,
                    category: '📍 Place',
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                    isLocal: false,
                  })
                })
              }
            }
          } catch {
            // silent fallback
          }
        }

        // Merge, deduplicate by close coordinates (within 0.001 deg)
        const combined = [...localMatches]
        apiResults.forEach((res) => {
          const exists = combined.some(
            (c) => Math.abs(c.lat - res.lat) < 0.001 && Math.abs(c.lon - res.lon) < 0.001
          )
          if (!exists) {
            combined.push(res)
          }
        })

        setSearchResults(combined.slice(0, 12))
        setShowSuggestions(true)
      } catch {
        // network fallback
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery, isKhmer, currentLang, defaultPopularSuggestions])

  // Select place from suggestion
  const handleSelectSuggestion = (place: any) => {
    setShowSuggestions(false)
    setSearchQuery(place.name || place.display_name.split(',')[0])
    panToLocation(parseFloat(place.lat), parseFloat(place.lon), 17)
  }

  // Handle Search Submission (instant trigger)
  const handleSubmitSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    // If we have search results already, select the top one immediately
    if (searchResults.length > 0) {
      handleSelectSuggestion(searchResults[0])
      return
    }

    if (!searchQuery.trim()) {
      setShowSuggestions(true)
      return
    }

    setIsSearching(true)
    try {
      const clean = cleanKhmerAdministrativePrefixes(searchQuery)
      const q = `${clean || searchQuery}, Cambodia`
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&countrycodes=kh&addressdetails=1&limit=5`,
        { headers: { 'Accept-Language': isKhmer ? 'km,en' : `${currentLang},en` } }
      )
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0]
          panToLocation(parseFloat(first.lat), parseFloat(first.lon), 17)
          setShowSuggestions(false)
        }
      }
    } catch {
      // ignore
    } finally {
      setIsSearching(false)
    }
  }

  // Confirm Location selection
  const handleConfirm = () => {
    onSelectLocation({
      latitude: Number(selectedPos.lat.toFixed(6)),
      longitude: Number(selectedPos.lng.toFixed(6)),
      address: resolvedAddress,
      city: resolvedCity,
      province: resolvedProvince,
      postal_code: resolvedPostalCode,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden font-sans"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container: Full-Screen Clean Google Maps UI */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-[88vh] min-h-[580px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 select-none"
        >
          {/* Full-Height Leaflet Map Canvas */}
          <div className="relative w-full h-full flex-1 overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* ─── 1. Google Maps Floating Search Bar & Filter Rail (Top-Left) ─── */}
            <div ref={searchBoxRef} className="absolute top-4 left-4 z-30 w-84 sm:w-96 max-w-[calc(100vw-5rem)] flex flex-col gap-2">
              {/* Google Search Card (Div-based to prevent form submission bubbling) */}
              <div
                className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 p-1 flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pl-3 text-rose-500">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSuggestions(true)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSubmitSearch()
                    }
                  }}
                  placeholder={t('customers.mapSearchPlaceholder', 'Search village, commune, district, province, landmarks...')}
                  className="w-full py-2.5 text-xs sm:text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-semibold"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSearchQuery('')
                      setSearchResults(defaultPopularSuggestions)
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSubmitSearch()
                  }}
                  className="mr-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {isSearching ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{t('common.search', 'Search')}</span>
                  )}
                </button>
              </div>

              {/* Google Maps Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Dropdown Header */}
                  <div className="px-3.5 py-2 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                    <span>
                      {searchQuery.trim()
                        ? t('customers.searchResults', 'Search Results')
                        : t('customers.popularPlaces', '📍 Popular Places')}
                    </span>
                    {isSearching && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Loader2 size={12} className="animate-spin" />
                        <span>{t('customers.searching', 'Searching...')}</span>
                      </span>
                    )}
                  </div>

                  {/* Results List */}
                  {searchResults.length > 0 ? (
                    searchResults.map((place, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(place)}
                        className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-start gap-2.5 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-500 group-hover:text-white transition-colors text-xs">
                          {place.category ? place.category.split(' ')[0] : '📍'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              {place.name || place.display_name.split(',')[0]}
                            </p>
                            {place.category && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                {place.category}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                            {place.subname || place.display_name}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      <p className="font-bold text-slate-600 dark:text-slate-300">
                        {t('customers.noLocationFound', 'No location found')}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {t('customers.trySearchingAnotherName', 'Try searching with another name or click map directly')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Province & Capital Filter Chips (All 25 Provinces) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-[calc(100vw-6rem)] sm:max-w-none">
                {CAMBODIA_GAZETTEER.filter((p) => p.category.includes('Province') || p.category.includes('Capital')).map((place) => (
                  <button
                    key={place.nameEn}
                    type="button"
                    onClick={() => panToLocation(place.lat, place.lng, 15)}
                    className="px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 shadow-md transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                  >
                    <span>{place.category.split(' ')[0]}</span>
                    <span>{isKhmer ? place.nameKm : place.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ─── 2. Top-Right Floating Close Button ─── */}
            <div className="absolute top-4 right-4 z-30">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 flex items-center justify-center shadow-xl border border-black/10 dark:border-white/10 active:scale-95 transition-all cursor-pointer"
                title={t('common.close', 'Close')}
              >
                <X size={18} />
              </button>
            </div>

            {/* ─── 3. Top-Center Instruction Pill ─── */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
              <div className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-black/10 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>{t('customers.mapInstruction', 'Click map or drag red pin to adjust location')}</span>
              </div>
            </div>

            {/* ─── 4. Google Maps Clean Layer Switcher (Bottom-Left) ─── */}
            <div className="absolute left-4 bottom-24 sm:bottom-20 z-30">
              <div className="relative">
                {/* Layer Square Thumbnail Button */}
                <button
                  type="button"
                  onClick={() => setShowLayerMenu(!showLayerMenu)}
                  className="group flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-white dark:border-slate-700 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden p-1"
                  title={t('customers.layers', 'Layers')}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md mb-0.5 group-hover:from-emerald-500 group-hover:to-teal-600 transition-all">
                    {currentLayerId === 'google_hybrid' ? <Globe size={18} /> : <Layers size={18} />}
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                    {t('customers.layers', 'Layers')}
                  </span>
                </button>

                {/* Layer Selector Flyout Panel */}
                {showLayerMenu && (
                  <div className="absolute bottom-full left-0 mb-2.5 p-3 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col gap-2 z-50 min-w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                      {t('customers.googleMapTypes', 'Google Map Types')}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {GOOGLE_MAP_LAYERS.map((layer) => {
                        const IconComp = layer.icon
                        const isCurrent = currentLayerId === layer.id
                        return (
                          <button
                            key={layer.id}
                            type="button"
                            onClick={() => switchLayer(layer.id)}
                            className={`p-2 rounded-xl text-left transition-all cursor-pointer border flex flex-col gap-1.5 ${
                              isCurrent
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                                <IconComp size={14} />
                              </div>
                              {isCurrent && <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />}
                            </div>
                            <div>
                              <p className="font-extrabold text-[11px] leading-tight">
                                {t(`customers.${layer.key}`, layer.fallbackName)}
                              </p>
                              <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                                {t(`customers.${layer.subKey}`, layer.fallbackSub)}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── 5. Bottom-Right Google Maps Pillar Controls ─── */}
            <div className="absolute right-4 bottom-24 sm:bottom-20 z-30 flex flex-col gap-2 shadow-2xl">
              <div className="flex flex-col rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg">
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors border-b border-slate-200 dark:border-slate-800 active:bg-slate-200 cursor-pointer"
                  title={t('customers.zoomIn', 'Zoom In')}
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors active:bg-slate-200 cursor-pointer"
                  title={t('customers.zoomOut', 'Zoom Out')}
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const initial = resolveInitialCoords()
                    panToLocation(initial.lat, initial.lng, 15)
                  }}
                  className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors active:bg-slate-200 cursor-pointer"
                  title={t('customers.resetCenter', 'Reset Center')}
                >
                  <RotateCcw size={15} />
                </button>
              </div>

              {/* GPS Locate Me Button */}
              <button
                type="button"
                onClick={() => handleLocateMe(false)}
                disabled={isLocating}
                className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center active:scale-95 transition-all shadow-lg cursor-pointer"
                title={t('customers.gpsMyLocation', 'My GPS Location')}
              >
                {isLocating ? (
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Crosshair size={18} />
                )}
              </button>
            </div>

            {/* ─── 6. Clean Floating Location Action Dock (Bottom-Center) ─── */}
            <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 sm:bottom-4 z-30 max-w-4xl mx-auto">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Left: Location Pin & Resolved Address Details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-2xs">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-black/5 dark:border-white/10">
                        {selectedPos.lat.toFixed(6)}, {selectedPos.lng.toFixed(6)}
                      </span>
                      {isReverseGeocoding ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse flex items-center gap-1">
                          <Sparkles size={12} />
                          {t('customers.resolvingAddress', 'Resolving address...')}
                        </span>
                      ) : resolvedCity ? (
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                          📍 {resolvedCity}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-1 font-semibold">
                      {resolvedAddress || t('customers.mapInstruction', 'Click map or drag red pin to adjust location')}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-6 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <Check size={17} strokeWidth={2.5} />
                    <span>{t('customers.confirmLocation', 'Confirm Location')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MapLocationPickerModal
