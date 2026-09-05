import { getAbsoluteImageUrl } from '@/utils/image'

export const COLOR_MAP: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  silver: '#C0C0C0',
  'space gray': '#4B5563',
  'space grey': '#4B5563',
  gray: '#6B7280',
  grey: '#6B7280',
  red: '#EF4444',
  blue: '#3B82F6',
  gold: '#D97706',
  'rose gold': '#F472B6',
  green: '#10B981',
  yellow: '#EAB308',
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316',
  brown: '#78350F',
  midnight: '#1E293B',
  starlight: '#F1F5F9',
  titanium: '#94A3B8',
}

export const normalizeColorKey = (color: string): string => {
  const c = (color || '').trim().toLowerCase()
  if (c === 'ខ្មៅ' || c === 'black' || c === 'space black' || c === 'midnight') return 'Black'
  if (c === 'ស' || c === 'white' || c === 'starlight') return 'White'
  if (c === 'ប្រាក់' || c === 'silver' || c === 'natural titanium' || c === 'desert titanium') return 'Silver'
  if (c === 'ប្រផេះអវកាស' || c === 'ប្រផេះ' || c === 'space gray' || c === 'titanium gray' || c === 'gray' || c === 'grey') return 'Space Gray'
  if (c === 'មាស' || c === 'gold' || c === 'rose gold') return 'Gold'
  if (c === 'ក្រហម' || c === 'red') return 'Red'
  if (c === 'ខៀវ' || c === 'blue') return 'Blue'
  if (c === 'បៃតង' || c === 'green') return 'Green'
  if (c === 'ស្វាយ' || c === 'purple' || c === 'violet') return 'Purple'
  if (c === 'ផ្កាឈូក' || c === 'pink') return 'Pink'
  if (c === 'លឿង' || c === 'yellow') return 'Yellow'
  if (c === 'ទឹកក្រូច' || c === 'orange') return 'Orange'
  if (c === 'ត្នោត' || c === 'brown') return 'Brown'
  return color
}

export const normalizeColorName = (rawColor: string): string => {
  if (!rawColor) return ''
  const trimmed = rawColor.trim()
  const lower = trimmed.toLowerCase()
  const colorMap: Record<string, string> = {
    'ខ្មៅ': 'Black', 'black': 'Black',
    'ស': 'White', 'white': 'White',
    'ប្រាក់': 'Silver', 'silver': 'Silver',
    'ប្រផេះតាន': 'Space Gray', 'ប្រផេះ': 'Space Gray', 'space gray': 'Space Gray', 'space grey': 'Space Gray',
    'ក្រហម': 'Red', 'red': 'Red',
    'ខៀវ': 'Blue', 'blue': 'Blue',
    'មាស': 'Gold', 'gold': 'Gold',
    'បៃតង': 'Green', 'green': 'Green',
    'ស្វាយ': 'Purple', 'purple': 'Purple',
    'ផ្កាឈូក': 'Pink', 'pink': 'Pink',
    'natural titanium': 'Natural Titanium',
    'space black': 'Space Black',
    'titanium gray': 'Titanium Gray',
    'titanium grey': 'Titanium Gray',
    'midnight': 'Midnight',
    'starlight': 'Starlight',
    'rose gold': 'Rose Gold',
  }
  return colorMap[lower] || colorMap[trimmed] || trimmed
}

export const getDynamicColorMatchedImage = (
  colorName: string,
  categoryPreset?: string,
  productImages?: any[],
  colorImageMap?: Record<string, string>,
  productTitle?: string
): string => {
  const cleanColor = (colorName || '').trim()
  const normalizedColor = normalizeColorKey(cleanColor)

  // 1. Check explicit colorImageMap assignment
  if (cleanColor && colorImageMap && colorImageMap[cleanColor]) {
    return colorImageMap[cleanColor]
  }
  if (normalizedColor && colorImageMap && colorImageMap[normalizedColor]) {
    return colorImageMap[normalizedColor]
  }

  // 2. Check if product gallery has images matching color keyword in title or filename
  if (cleanColor && productImages && productImages.length > 0) {
    const matchedGalleryImg = productImages.find((img: any) => {
      const urlOrAlt = (img.url || img.image || img.alt || '').toLowerCase()
      return urlOrAlt.includes(cleanColor.toLowerCase()) || (normalizedColor && urlOrAlt.includes(normalizedColor.toLowerCase()))
    })
    if (matchedGalleryImg?.url || matchedGalleryImg?.image) {
      return getAbsoluteImageUrl(matchedGalleryImg.url || matchedGalleryImg.image)
    }
  }

  // 3. AI Category & Product Type Context Analyzer
  const titleLower = (productTitle || '').toLowerCase()
  const presetLower = (categoryPreset || '').toLowerCase()

  const isPhone = presetLower.includes('phone') || titleLower.includes('phone') || titleLower.includes('iphone') || titleLower.includes('galaxy') || titleLower.includes('mobile') || titleLower.includes('smartphone') || titleLower.includes('tablet') || titleLower.includes('ipad') || titleLower.includes('pro max')
  const isWatch = presetLower.includes('watch') || titleLower.includes('watch') || titleLower.includes('apple watch') || titleLower.includes('smartwatch')
  const isLaptop = presetLower.includes('tech_spec') || presetLower.includes('laptop') || titleLower.includes('macbook') || titleLower.includes('laptop') || titleLower.includes('notebook') || titleLower.includes('pc')
  const isShoe = presetLower.includes('shoe') || titleLower.includes('shoe') || titleLower.includes('sneaker') || titleLower.includes('nike') || titleLower.includes('footwear')
  const isKeyboard = presetLower.includes('keyboard') || titleLower.includes('keyboard') || titleLower.includes('keychron')
  const isApparel = presetLower.includes('apparel') || titleLower.includes('shirt') || titleLower.includes('clothing') || titleLower.includes('fashion')

  // Category specific color catalogs
  const phoneCatalog: Record<string, string> = {
    'Black': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'White': 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    'Silver': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    'Space Gray': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    'Natural Titanium': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    'Desert Titanium': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    'Space Black': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'Titanium Gray': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    'Midnight': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'Starlight': 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    'Rose Gold': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    'Red': 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600&auto=format&fit=crop&q=80',
    'Blue': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    'Gold': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    'Green': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&auto=format&fit=crop&q=80',
    'Purple': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
    'Pink': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    'Yellow': 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    'Orange': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
  }

  const watchCatalog: Record<string, string> = {
    'Black': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    'White': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    'Silver': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'Midnight': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    'Starlight': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    'Rose Gold': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    'Space Gray': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
  }

  const laptopCatalog: Record<string, string> = {
    'Black': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    'Space Black': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    'White': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    'Silver': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80',
    'Space Gray': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
  }

  const shoeCatalog: Record<string, string> = {
    'Black': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'White': 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80',
    'Silver': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
  }

  const keyboardCatalog: Record<string, string> = {
    'Black': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    'White': 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
  }

  const apparelCatalog: Record<string, string> = {
    'Black': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'White': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    'Silver': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
  }

  const monitorCatalog: Record<string, string> = {
    'Black': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    'White': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    'Silver': 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80',
    'Space Gray': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80',
  }

  let selectedCatalog = monitorCatalog
  if (isPhone) selectedCatalog = phoneCatalog
  else if (isWatch) selectedCatalog = watchCatalog
  else if (isLaptop) selectedCatalog = laptopCatalog
  else if (isShoe) selectedCatalog = shoeCatalog
  else if (isKeyboard) selectedCatalog = keyboardCatalog
  else if (isApparel) selectedCatalog = apparelCatalog

  if (normalizedColor && selectedCatalog[normalizedColor]) {
    return selectedCatalog[normalizedColor]
  }

  if (cleanColor && selectedCatalog[cleanColor]) {
    return selectedCatalog[cleanColor]
  }

  // 4. Primary image fallback or gallery first image
  const primaryImg = productImages?.find((img: any) => img.is_primary)?.url || productImages?.[0]?.url
  if (primaryImg) return getAbsoluteImageUrl(primaryImg)

  // 5. Default category hero photo fallback
  if (isPhone) return phoneCatalog['Black']
  if (isWatch) return watchCatalog['Black']
  if (isLaptop) return laptopCatalog['Black']
  if (isShoe) return shoeCatalog['Black']
  if (isKeyboard) return keyboardCatalog['Black']
  if (isApparel) return apparelCatalog['Black']

  return monitorCatalog['Black']
}

export const COLOR_MATCHED_IMAGES: Record<string, Record<string, string>> = new Proxy(
  {},
  {
    get: (_, presetKey: string) => {
      return new Proxy(
        {},
        {
          get: (_, colorName: string) => {
            return getDynamicColorMatchedImage(colorName, presetKey)
          }
        }
      )
    }
  }
)

export const getVariantColorHex = (v: any): string | null => {
  if (!v) return null
  if (v.color_code) return v.color_code
  if (v.attributes && Array.isArray(v.attributes)) {
    for (const attr of v.attributes) {
      if (attr.color_code) return attr.color_code
      if (attr.attribute_name?.toLowerCase().includes('color') || attr.name?.toLowerCase().includes('color')) {
        const valLower = String(attr.value || '').toLowerCase()
        if (COLOR_MAP[valLower]) return COLOR_MAP[valLower]
      }
    }
  }
  const nameLower = String(v.name || '').toLowerCase()
  for (const [colorName, hex] of Object.entries(COLOR_MAP)) {
    if (nameLower.includes(colorName)) {
      return hex
    }
  }
  return null
}
