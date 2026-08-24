import React, { useEffect, useRef, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapPin,
  Search,
  Crosshair,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Globe,
  Sun,
  Moon,
  Home,
  Building2,
  Package,
  Store,
  ExternalLink,
  Edit2,
  Phone,
  Navigation,
  CheckCircle2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { CustomerAddress } from '@/components/common'

interface CustomerAddressMapExplorerProps {
  addresses: CustomerAddress[]
  onEditAddress: (address: CustomerAddress) => void
  isLoading?: boolean
}

// Google Maps Official Tile Layers with 5-Language metadata
const MAP_LAYERS = [
  {
    id: 'google_streets',
    key: 'layerGoogleRoads',
    subKey: 'layerGoogleRoadsSub',
    fallbackName: 'Google Roads (Standard)',
    icon: MapPin,
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    maxZoom: 20,
  },
  {
    id: 'google_hybrid',
    key: 'layerGoogleHybrid',
    subKey: 'layerGoogleHybridSub',
    fallbackName: 'Google Satellite (Hybrid)',
    icon: Globe,
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Imagery',
    maxZoom: 20,
  },
  {
    id: 'google_terrain',
    key: 'layerGoogleTerrain',
    subKey: 'layerGoogleTerrainSub',
    fallbackName: 'Google Terrain',
    icon: Sun,
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain',
    maxZoom: 20,
  },
  {
    id: 'dark',
    key: 'layerDarkMode',
    subKey: 'layerDarkModeSub',
    fallbackName: 'Dark Mode',
    icon: Moon,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    maxZoom: 19,
  },
]

// Cambodia Quick Administrative Centers
const CAMBODIA_CITIES = [
  { nameKm: 'ភ្នំពេញ', nameEn: 'Phnom Penh', lat: 11.5564, lng: 104.9282 },
  { nameKm: 'សៀមរាប', nameEn: 'Siem Reap', lat: 13.3671, lng: 103.8448 },
  { nameKm: 'បាត់ដំបង', nameEn: 'Battambang', lat: 13.0957, lng: 103.2022 },
  { nameKm: 'ព្រះសីហនុ', nameEn: 'Sihanoukville', lat: 10.6275, lng: 103.5221 },
  { nameKm: 'កំពង់ធំ', nameEn: 'Kampong Thom', lat: 12.7111, lng: 104.8887 },
  { nameKm: 'កំពង់ចាម', nameEn: 'Kampong Cham', lat: 11.9924, lng: 105.4645 },
  { nameKm: 'កំពត', nameEn: 'Kampot', lat: 10.6104, lng: 104.1815 },
]

// Generate Pin Icon for Customer Address based on Type
const createCustomerAddressIcon = (label: string, isDefault: boolean) => {
  const norm = (label || '').toLowerCase()
  let bgGradient = 'linear-gradient(135deg, #10B981, #059669)' // Emerald default

  if (norm.includes('home')) {
    bgGradient = 'linear-gradient(135deg, #3B82F6, #1D4ED8)' // Blue
  } else if (norm.includes('office') || norm.includes('work') || norm.includes('hq')) {
    bgGradient = 'linear-gradient(135deg, #8B5CF6, #6D28D9)' // Purple
  } else if (norm.includes('warehouse') || norm.includes('storage')) {
    bgGradient = 'linear-gradient(135deg, #F59E0B, #D97706)' // Amber
  } else if (norm.includes('store') || norm.includes('shop') || norm.includes('branch')) {
    bgGradient = 'linear-gradient(135deg, #06B6D4, #0891B2)' // Cyan
  }

  const starBadge = isDefault
    ? `<div style="position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; background: #EAB308; border: 2px solid white; border-radius: 50%;"></div>`
    : ''

  return L.divIcon({
    className: 'custom-customer-pin',
    html: `
      <div style="position: relative; width: 36px; height: 42px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <div style="width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: ${bgGradient}; border: 2.5px solid white; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 1px 2px rgba(255,255,255,0.4);">
          <div style="transform: rotate(45deg); width: 10px; height: 10px; border-radius: 50%; background: white;"></div>
        </div>
        ${starBadge}
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 38],
    popupAnchor: [0, -36],
  })
}

export const CustomerAddressMapExplorer: React.FC<CustomerAddressMapExplorerProps> = ({
  addresses,
  onEditAddress,
  isLoading,
}) => {
  const { t, i18n } = useTranslation(['customers', 'common'])
  const currentLang = i18n.language || 'en'
  const isKhmer = currentLang === 'km'

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const activeTileLayerRef = useRef<L.TileLayer | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLabelFilter, setSelectedLabelFilter] = useState('all')
  const [currentLayerId, setCurrentLayerId] = useState('google_streets')
  const [showLayerMenu, setShowLayerMenu] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  // Filter addresses that have valid coordinates
  const validAddresses = useMemo(() => {
    return addresses.filter(
      (a) =>
        a.latitude !== null &&
        a.longitude !== null &&
        !isNaN(Number(a.latitude)) &&
        !isNaN(Number(a.longitude)) &&
        Number(a.latitude) !== 0 &&
        Number(a.longitude) !== 0
    )
  }, [addresses])

  // Filter by search & label
  const filteredAddresses = useMemo(() => {
    return validAddresses.filter((a) => {
      // Label filter
      if (selectedLabelFilter !== 'all') {
        const norm = (a.label || '').toLowerCase()
        if (selectedLabelFilter === 'home' && !norm.includes('home')) return false
        if (selectedLabelFilter === 'office' && !norm.includes('office') && !norm.includes('work') && !norm.includes('hq')) return false
        if (selectedLabelFilter === 'warehouse' && !norm.includes('warehouse')) return false
        if (selectedLabelFilter === 'default' && !a.is_default) return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = a.customer?.name?.toLowerCase().includes(q)
        const matchRecipient = a.name?.toLowerCase().includes(q)
        const matchPhone = a.phone?.toLowerCase().includes(q)
        const matchAddress = a.address?.toLowerCase().includes(q)
        const matchCity = a.city?.toLowerCase().includes(q)
        const matchProvince = a.province?.toLowerCase().includes(q)
        return matchName || matchRecipient || matchPhone || matchAddress || matchCity || matchProvince
      }

      return true
    })
  }, [validAddresses, selectedLabelFilter, searchQuery])

  // Switch Layer
  const switchLayer = (layerId: string) => {
    setCurrentLayerId(layerId)
    setShowLayerMenu(false)
    const layerDef = MAP_LAYERS.find((l) => l.id === layerId) || MAP_LAYERS[0]
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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const defaultCenter: [number, number] =
      validAddresses.length > 0
        ? [Number(validAddresses[0].latitude), Number(validAddresses[0].longitude)]
        : [11.5564, 104.9282]

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false,
    })

    const initialLayerDef = MAP_LAYERS.find((l) => l.id === currentLayerId) || MAP_LAYERS[0]
    const tileLayer = L.tileLayer(initialLayerDef.url, {
      attribution: initialLayerDef.attribution,
      maxZoom: initialLayerDef.maxZoom,
    }).addTo(map)
    activeTileLayerRef.current = tileLayer

    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer
    mapInstanceRef.current = map

    setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update Markers whenever filtered addresses change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return

    markersLayerRef.current.clearLayers()

    const bounds = L.latLngBounds([])

    filteredAddresses.forEach((addr) => {
      const lat = Number(addr.latitude)
      const lng = Number(addr.longitude)
      const isDefault = Boolean(addr.is_default)
      const icon = createCustomerAddressIcon(addr.label || '', isDefault)

      const marker = L.marker([lat, lng], { icon })

      const customerName = addr.customer?.name || addr.name || t('customers.tab_customers', 'Customer')
      const phone = addr.phone || (addr.customer as any)?.phone || '-'
      const fullAddress = [addr.address, addr.city, addr.province].filter(Boolean).join(', ')
      const gmapsLink = `https://www.google.com/maps?q=${lat},${lng}`

      const popupHtml = `
        <div style="font-family: inherit; min-width: 220px; max-width: 280px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; background: #ecfdf5; color: #047857; padding: 2px 8px; border-radius: 6px; border: 1px solid #a7f3d0;">
              ${addr.label || t('customers.address', 'Address')}
            </span>
            ${
              isDefault
                ? `<span style="font-size: 10px; font-weight: 800; background: #fef9c3; color: #854d0e; padding: 2px 6px; border-radius: 6px;">⭐ ${t('customers.defaultBadge', 'Default')}</span>`
                : ''
            }
          </div>
          
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 800; color: #0f172a;">
            ${customerName}
          </h4>
          
          <p style="margin: 0 0 6px; font-size: 12px; color: #64748b; line-height: 1.35;">
            📍 ${fullAddress}
          </p>
          
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px; font-size: 12px; color: #334155; font-weight: 600;">
            <span>📞</span>
            <span>${phone}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
            <a href="${gmapsLink}" target="_blank" rel="noreferrer" style="flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 6px 8px; border-radius: 8px; text-decoration: none; border: 1px solid #bfdbfe;">
              ${t('customers.openInGoogleMaps', 'Google Maps')} ↗
            </a>
          </div>
        </div>
      `

      marker.bindPopup(popupHtml, {
        className: 'custom-map-popup',
        closeButton: true,
        autoPan: true,
      })

      marker.on('click', () => {
        setSelectedAddress(addr)
      })

      marker.addTo(markersLayerRef.current!)
      bounds.extend([lat, lng])
    })

    // Fit map bounds if we have points
    if (filteredAddresses.length > 0 && mapInstanceRef.current) {
      if (filteredAddresses.length === 1) {
        mapInstanceRef.current.setView(
          [Number(filteredAddresses[0].latitude), Number(filteredAddresses[0].longitude)],
          15
        )
      } else {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
      }
    }
  }, [filteredAddresses, t])

  // Fly to location
  const panToCoord = (lat: number, lng: number, zoom = 16) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 })
    }
  }

  // Device GPS Locate
  const handleLocateMe = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false)
          panToCoord(pos.coords.latitude, pos.coords.longitude, 16)
        },
        () => setIsLocating(false),
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      setIsLocating(false)
    }
  }

  return (
    <div className="relative w-full h-[680px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 flex flex-col select-none font-sans">
      {/* ─── Leaflet Map Canvas ─── */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* ─── Top Floating Search & Filter Bar ─── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        {/* Search Input */}
        <div className="pointer-events-auto w-full sm:w-84 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/10 dark:border-white/10 p-1.5 flex items-center gap-2">
          <div className="pl-2.5 text-rose-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('customers.mapSearchPlaceholder', 'Search customer, address, phone...')}
            className="w-full text-xs bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-semibold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Type Filter Chips */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: t('customers.allAddresses', 'All Addresses') },
            { id: 'home', label: `🏠 ${t('customers.home', 'Home')}` },
            { id: 'office', label: `🏢 ${t('customers.office', 'Office')}` },
            { id: 'warehouse', label: `📦 ${t('customers.warehouse', 'Warehouse')}` },
            { id: 'default', label: `⭐ ${t('customers.defaultBadge', 'Default')}` },
          ].map((f) => {
            const isActive = selectedLabelFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedLabelFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-500/30'
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Bottom-Left: Google Maps Layer Switcher ─── */}
      <div className="absolute left-4 bottom-4 z-20">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="w-14 h-14 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title={t('customers.layers', 'Layers')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-sm mb-0.5">
              {currentLayerId === 'google_hybrid' ? <Globe size={16} /> : <Layers size={16} />}
            </div>
            <span className="text-[9px] font-extrabold text-slate-800 dark:text-slate-200">
              {t('customers.layers', 'Layers')}
            </span>
          </button>

          {showLayerMenu && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col gap-1.5 z-50 min-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1">
                {t('customers.googleMapTypes', 'Map Type')}
              </div>
              {MAP_LAYERS.map((layer) => {
                const IconComp = layer.icon
                const isCurrent = currentLayerId === layer.id
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => switchLayer(layer.id)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp size={15} />
                      <span>{t(`customers.${layer.key}`, layer.fallbackName)}</span>
                    </div>
                    {isCurrent && <CheckCircle2 size={14} className="text-emerald-600" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom-Right: Map Pillar Controls ─── */}
      <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-2 shadow-2xl">
        <div className="flex flex-col rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors border-b border-slate-200 dark:border-slate-800 cursor-pointer"
            title={t('customers.zoomIn', 'Zoom In')}
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors cursor-pointer"
            title={t('customers.zoomOut', 'Zoom Out')}
          >
            <ZoomOut size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
          title={t('customers.gpsMyLocation', 'Locate Me')}
        >
          {isLocating ? (
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Crosshair size={18} />
          )}
        </button>
      </div>

      {/* ─── Bottom-Center Floating Statistics Card ─── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
        <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center gap-4 text-xs font-extrabold text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <MapPin size={15} />
            <span>
              {filteredAddresses.length} / {validAddresses.length} {t('customers.mappedAddresses', 'Delivery Points')}
            </span>
          </div>
          <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('customers.clickMarkerHint', 'Click pin to view full details & actions')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerAddressMapExplorer
