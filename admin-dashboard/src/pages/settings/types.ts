export type TabType = 'templates' | 'typography' | 'layout' | 'widgets'

export interface ThemeTemplate {
  id: string
  nameKey: string
  defaultName: string
  descKey: string
  defaultDesc: string
  primaryColor: string
  mode: 'light' | 'dark' | 'system'
  gradient: string
  badgeColor: string
}

export interface PanelTemplate {
  id: string
  nameKey: string
  descKey: string
  sidebarBg: string
  sidebarText: string
  activeBg: string
  activeText: string
  navbarBg: string
  navbarText: string
  navbarBorder: string
}

export const THEME_TEMPLATES: ThemeTemplate[] = [
  {
    id: 'coral_pink',
    nameKey: 'tplCoralPink',
    defaultName: 'ផ្កាឈូក Enterprise',
    descKey: 'tplCoralPinkDesc',
    defaultDesc: 'ទម្រង់ផ្កាឈូកបែប Enterprise ស្រស់ស្អាត ពេញនិយម និងងាយស្រួលមើល',
    primaryColor: '#ec4899',
    mode: 'light',
    gradient: 'from-pink-500 to-rose-500',
    badgeColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  },
  {
    id: 'sapphire_blue',
    nameKey: 'tplSapphireBlue',
    defaultName: 'ខៀវ Sapphire',
    descKey: 'tplSapphireBlueDesc',
    defaultDesc: 'ទម្រង់ពណ៌ខៀវសាជីវកម្ម វិជ្ជាជីវៈ និងទាន់សម័យ',
    primaryColor: '#3b82f6',
    mode: 'light',
    gradient: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    id: 'emerald_green',
    nameKey: 'tplEmeraldGreen',
    defaultName: 'បៃតង Emerald',
    descKey: 'tplEmeraldGreenDesc',
    defaultDesc: 'ទម្រង់ពណ៌បៃតងស្រស់ សម្រាប់ហាងលក់ទំនិញ និងឱសថស្ថាន',
    primaryColor: '#10b981',
    mode: 'light',
    gradient: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'amethyst_purple',
    nameKey: 'tplAmethystPurple',
    defaultName: 'ស្វាយ VIP',
    descKey: 'tplAmethystPurpleDesc',
    defaultDesc: 'ទម្រង់ពណ៌ស្វាយប្រណីត សម្រាប់ហាង VIP និងគ្រឿងអលង្ការ',
    primaryColor: '#8b5cf6',
    mode: 'light',
    gradient: 'from-purple-500 to-indigo-600',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  {
    id: 'amber_gold',
    nameKey: 'tplAmberGold',
    defaultName: 'មាស Sunset',
    descKey: 'tplAmberGoldDesc',
    defaultDesc: 'ទម្រង់ពណ៌ទឹកក្រូចមាស សម្រាប់ភោជនីយដ្ឋាន និងហាងកាហ្វេ',
    primaryColor: '#f59e0b',
    mode: 'light',
    gradient: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  {
    id: 'obsidian_dark',
    nameKey: 'tplObsidianDark',
    defaultName: 'ខ្មៅ Midnight',
    descKey: 'tplObsidianDarkDesc',
    defaultDesc: 'ទម្រង់ Dark Mode កម្រិតខ្ពស់ ងាយស្រួលភ្នែកពេលយប់',
    primaryColor: '#6366f1',
    mode: 'dark',
    gradient: 'from-slate-800 to-slate-950',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
]

export interface PanelTemplate {
  id: string
  nameKey: string
  defaultName: string
  descKey: string
  defaultDesc: string
  badgeKey?: string
  defaultBadge?: string
  sidebarBg: string
  sidebarText: string
  activeBg: string
  activeText: string
  navbarBg: string
  navbarText: string
  navbarBorder: string
}

export const panelTemplates: PanelTemplate[] = [
  {
    id: 'midnight',
    nameKey: 'tplPanelMidnight',
    defaultName: 'Enterprise Midnight Pro',
    descKey: 'tplPanelMidnightDesc',
    defaultDesc: 'រចនាបថ Midnight Slate ងងឹតស៊ីវិល័យ រំលេចប៊ូតុង Coral Pink Neon របារខាងលើថ្លាប្រណីត',
    defaultBadge: 'Enterprise Dark',
    sidebarBg: '#0b1329',
    sidebarText: '#94a3b8',
    activeBg: '#ec4899',
    activeText: '#ffffff',
    navbarBg: '#ffffff',
    navbarText: '#0f172a',
    navbarBorder: '#e2e8f0',
  },
  {
    id: 'sapphire',
    nameKey: 'tplPanelSapphire',
    defaultName: 'Royal Sapphire Executive',
    descKey: 'tplPanelSapphireDesc',
    defaultDesc: 'រចនាបថ Deep Navy សាជីវកម្មលំដាប់ខ្ពស់ រំលេចប៊ូតុង Royal Blue ស្រស់ច្បាស់ទាន់សម័យ',
    defaultBadge: 'Corporate Pro',
    sidebarBg: '#0a192f',
    sidebarText: '#93c5fd',
    activeBg: '#2563eb',
    activeText: '#ffffff',
    navbarBg: '#ffffff',
    navbarText: '#0f172a',
    navbarBorder: '#e2e8f0',
  },
  {
    id: 'emerald',
    nameKey: 'tplPanelEmerald',
    defaultName: 'Emerald Aurora Green',
    descKey: 'tplPanelEmeraldDesc',
    defaultDesc: 'រចនាបថ Velvet Forest បៃតងចាស់ រំលេចប៊ូតុង Aurora Mint ស្រស់ត្រជាក់ភ្នែក',
    defaultBadge: 'Fresh Nature',
    sidebarBg: '#042219',
    sidebarText: '#a7f3d0',
    activeBg: '#10b981',
    activeText: '#ffffff',
    navbarBg: '#ffffff',
    navbarText: '#0f172a',
    navbarBorder: '#e2e8f0',
  },
  {
    id: 'amethyst',
    nameKey: 'tplPanelAmethyst',
    defaultName: 'Imperial Amethyst VIP',
    descKey: 'tplPanelAmethystDesc',
    defaultDesc: 'រចនាបថ Luxury Midnight Violet រំលេចប៊ូតុង VIP Purple Glow សម្រាប់អាជីវកម្មប្រណីត',
    defaultBadge: 'Luxury VIP',
    sidebarBg: '#130924',
    sidebarText: '#d8b4fe',
    activeBg: '#8b5cf6',
    activeText: '#ffffff',
    navbarBg: '#ffffff',
    navbarText: '#0f172a',
    navbarBorder: '#e2e8f0',
  },
  {
    id: 'obsidian',
    nameKey: 'tplPanelObsidian',
    defaultName: 'Cyberpunk Obsidian Gold',
    descKey: 'tplPanelObsidianDesc',
    defaultDesc: 'រចនាបថ Dark Carbon ខ្មៅដិត រំលេចប៊ូតុង Sunset Amber Gold របារខាងលើ Titanium Dark',
    defaultBadge: 'Full Dark Gold',
    sidebarBg: '#09090b',
    sidebarText: '#a1a1aa',
    activeBg: '#f59e0b',
    activeText: '#ffffff',
    navbarBg: '#141417',
    navbarText: '#f4f4f5',
    navbarBorder: '#27272a',
  },
  {
    id: 'minimalist',
    nameKey: 'tplPanelMinimalist',
    defaultName: 'Pure Minimalist Snow',
    descKey: 'tplPanelMinimalistDesc',
    defaultDesc: 'រចនាបថ Snow White សសុទ្ធស្អាតទន់ភ្លន់ រំលេចប៊ូតុង Electric Indigo របារខាងលើទំនើប',
    defaultBadge: 'Minimalist Light',
    sidebarBg: '#ffffff',
    sidebarText: '#334155',
    activeBg: '#4f46e5',
    activeText: '#ffffff',
    navbarBg: '#ffffff',
    navbarText: '#0f172a',
    navbarBorder: '#f1f5f9',
  },
]
