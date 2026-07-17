import React, { useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import type { WidgetConfig } from '@/stores/themeStore'
import {
  Palette, Type, Sliders, Layout, Grid, RefreshCw, Eye, MoveUp, MoveDown, HelpCircle, AlertTriangle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const fontFamilies = ['Default', 'Inter', 'Kantumruy Pro', 'system-ui', 'monospace', 'sans-serif']
const fontSizes = ['12px', '13px', '14px', '15px', '16px', '18px']
const fontWeights = ['300', '400', '500', '600', '700']
const lineHeights = ['1.2', '1.3', '1.4', '1.5', '1.6', '1.7']
const letterSpacings = ['-0.05em', '0px', '0.025em', '0.05em', '0.1em']

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

const densityOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
]

const radiusPresets = [
  { value: '0px', label: 'Sharp' },
  { value: '0.25rem', label: 'Small (4px)' },
  { value: '0.5rem', label: 'Medium (8px)' },
  { value: '0.75rem', label: 'Large (12px)' },
  { value: '1rem', label: 'Extra Large (16px)' },
]

const paddingPresets = [
  { value: '0.75rem', label: 'Compact (12px)' },
  { value: '1rem', label: 'Normal (16px)' },
  { value: '1.5rem', label: 'Relaxed (24px)' },
  { value: '2rem', label: 'Spacious (32px)' },
]

const AppearanceSettings: React.FC = () => {
  const { t } = useTranslation()
  const customizer = useThemeStore()
  const [activeTab, setActiveTab] = useState<'theme' | 'fonts' | 'panels' | 'components' | 'widgets'>('theme')

  const handleWidgetToggle = (id: string) => {
    const list = customizer.widgetsList.map(w => w.id === id ? { ...w, visible: !w.visible } : w)
    customizer.updateWidgetsList(list)
  }

  const handleWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    const list = customizer.widgetsList.map(w => w.id === id ? { ...w, size } : w)
    customizer.updateWidgetsList(list)
  }

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const list = [...customizer.widgetsList].sort((a, b) => a.order - b.order)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= list.length) return

    // Swap order property
    const temp = list[index].order
    list[index].order = list[targetIndex].order
    list[targetIndex].order = temp

    customizer.updateWidgetsList(list)
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      {/* Side Tabs */}
      <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border bg-muted/20 p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible no-scrollbar shrink-0">
        {[
          { id: 'theme', label: 'Theme & Color', icon: <Palette size={16} /> },
          { id: 'fonts', label: 'Typography', icon: <Type size={16} /> },
          { id: 'panels', label: 'Sidebar & Navbar', icon: <Sliders size={16} /> },
          { id: 'components', label: 'UI Components', icon: <Layout size={16} /> },
          { id: 'widgets', label: 'Dashboard Widgets', icon: <Grid size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-border hidden md:block p-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all appearance preferences to defaults?')) {
                customizer.resetAll()
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <RefreshCw size={12} />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Tab Panel */}
      <div className="flex-1 p-6 space-y-6">
        {/* Tab 1: Theme & Colors */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Theme & Primary Color</h3>
              <p className="text-muted-foreground text-xs">Set your system color scheme and accents</p>
            </div>

            {/* Mode Select */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">Theme Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => customizer.updateThemeMode(mode as any)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all capitalize
                      ${customizer.themeMode === mode
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'}`}
                  >
                    {mode} Mode
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">Primary Accent Color</label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { hex: '#3b82f6', label: 'Blue' },
                  { hex: '#10b981', label: 'Green' },
                  { hex: '#8b5cf6', label: 'Violet' },
                  { hex: '#f59e0b', label: 'Amber' },
                  { hex: '#ef4444', label: 'Red' },
                  { hex: '#ec4899', label: 'Pink' },
                  { hex: '#14b8a6', label: 'Teal' },
                  { hex: '#6366f1', label: 'Indigo' },
                ].map(col => (
                  <button
                    key={col.hex}
                    onClick={() => customizer.updatePrimaryColor(col.hex)}
                    style={{ backgroundColor: col.hex }}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                      ${customizer.primaryColor === col.hex ? 'border-foreground scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                    title={col.label}
                  />
                ))}
              </div>

              {/* Custom HEX code input */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: customizer.primaryColor }} />
                <div className="flex-1 max-w-[200px]">
                  <input
                    type="text"
                    value={customizer.primaryColor}
                    onChange={e => customizer.updatePrimaryColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="form-input font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Typography & Preview */}
        {activeTab === 'fonts' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Typography Customizer</h3>
              <p className="text-muted-foreground text-xs">Personalize font sizing, weights, spacing, and preview rendering</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Font Family</label>
                <select
                  value={customizer.font.family}
                  onChange={e => customizer.updateFont({ family: e.target.value })}
                  className="form-input"
                >
                  {fontFamilies.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Base Font Size</label>
                <select
                  value={customizer.font.size}
                  onChange={e => customizer.updateFont({ size: e.target.value })}
                  className="form-input"
                >
                  {fontSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Font Weight</label>
                <select
                  value={customizer.font.weight}
                  onChange={e => customizer.updateFont({ weight: e.target.value })}
                  className="form-input"
                >
                  {fontWeights.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Line Height</label>
                <select
                  value={customizer.font.lineHeight}
                  onChange={e => customizer.updateFont({ lineHeight: e.target.value })}
                  className="form-input"
                >
                  {lineHeights.map(lh => (
                    <option key={lh} value={lh}>{lh}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Letter Spacing</label>
                <select
                  value={customizer.font.letterSpacing}
                  onChange={e => customizer.updateFont({ letterSpacing: e.target.value })}
                  className="form-input"
                >
                  {letterSpacings.map(ls => (
                    <option key={ls} value={ls}>{ls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font Preview Area */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <Eye size={12} />
                Live Font Rendering Preview
              </label>
              <div
                className="p-5 border border-border rounded-xl bg-muted/30 space-y-3"
                style={{
                  fontFamily: customizer.font.family !== 'Default' ? customizer.font.family : undefined,
                  fontSize: customizer.font.size,
                  fontWeight: customizer.font.weight,
                  lineHeight: customizer.font.lineHeight,
                  letterSpacing: customizer.font.letterSpacing,
                }}
              >
                <p className="font-semibold text-foreground">
                  English Font Preview: ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890
                </p>
                <p className="text-muted-foreground text-sm">
                  Khmer Font Preview (Kantumruy Pro): ភាសាខ្មែរ ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sidebar & Navbar Panel config */}
        {activeTab === 'panels' && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Sidebar configurations */}
            <div className="space-y-4 pb-4 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Sidebar Panels</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Background Color</label>
                  <input
                    type="color"
                    value={customizer.sidebar.bgColor}
                    onChange={e => customizer.updateSidebar({ bgColor: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Text Color</label>
                  <input
                    type="color"
                    value={customizer.sidebar.textColor}
                    onChange={e => customizer.updateSidebar({ textColor: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Active Menu Bg</label>
                  <input
                    type="color"
                    value={customizer.sidebar.activeBgColor}
                    onChange={e => customizer.updateSidebar({ activeBgColor: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Active Menu Text</label>
                  <input
                    type="color"
                    value={customizer.sidebar.activeTextColor}
                    onChange={e => customizer.updateSidebar({ activeTextColor: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Sidebar Width (px)</label>
                  <input
                    type="number"
                    value={customizer.sidebar.width}
                    onChange={e => customizer.updateSidebar({ width: Number(e.target.value) })}
                    min={180}
                    max={320}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Rounded Style</label>
                  <select
                    value={customizer.sidebar.roundedStyle}
                    onChange={e => customizer.updateSidebar({ roundedStyle: e.target.value })}
                    className="form-input"
                  >
                    {radiusPresets.map(preset => (
                      <option key={preset.value} value={preset.value}>{preset.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={customizer.sidebar.compact}
                    onChange={e => customizer.updateSidebar({ compact: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Compact Sidebar</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={customizer.sidebar.collapsed}
                    onChange={e => customizer.updateSidebar({ collapsed: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Collapsed Mode</span>
                </label>
              </div>
            </div>

            {/* Navbar configurations */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Top Navbar</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Background</label>
                  <input
                    type="color"
                    value={customizer.navbar.bgColor}
                    onChange={e => customizer.updateNavbar({ bgColor: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Text Color</label>
                  <input
                    type="color"
                    value={customizer.navbar.textColor}
                    onChange={e => customizer.updateNavbar({ textColor: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Border Color</label>
                  <input
                    type="color"
                    value={customizer.navbar.borderColor}
                    onChange={e => customizer.updateNavbar({ borderColor: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Height (px)</label>
                  <input
                    type="number"
                    value={customizer.navbar.height}
                    onChange={e => customizer.updateNavbar({ height: Number(e.target.value) })}
                    min={48}
                    max={96}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Transparency</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={customizer.navbar.transparency}
                    onChange={e => customizer.updateNavbar({ transparency: Number(e.target.value) })}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Shadow</label>
                  <select
                    value={customizer.navbar.shadow}
                    onChange={e => customizer.updateNavbar({ shadow: e.target.value as any })}
                    className="form-input"
                  >
                    {shadowOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Components & Layout details */}
        {activeTab === 'components' && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Border Radius section */}
            <div className="space-y-4 pb-4 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Radii & Spacings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Card Radius</label>
                  <select
                    value={customizer.layout.cardRadius}
                    onChange={e => customizer.updateLayout({ cardRadius: e.target.value })}
                    className="form-input"
                  >
                    {radiusPresets.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Table Radius</label>
                  <select
                    value={customizer.layout.tableRadius}
                    onChange={e => customizer.updateLayout({ tableRadius: e.target.value })}
                    className="form-input"
                  >
                    {radiusPresets.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Button Radius</label>
                  <select
                    value={customizer.layout.buttonRadius}
                    onChange={e => customizer.updateLayout({ buttonRadius: e.target.value })}
                    className="form-input"
                  >
                    {radiusPresets.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Input Radius</label>
                  <select
                    value={customizer.layout.inputRadius}
                    onChange={e => customizer.updateLayout({ inputRadius: e.target.value })}
                    className="form-input"
                  >
                    {radiusPresets.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Container Padding</label>
                <select
                  value={customizer.layout.padding}
                  onChange={e => customizer.updateLayout({ padding: e.target.value })}
                  className="form-input"
                >
                  {paddingPresets.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tables customization */}
            <div className="space-y-4 pb-4 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Data Tables</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Table Density</label>
                  <select
                    value={customizer.table.density}
                    onChange={e => customizer.updateTable({ density: e.target.value as any })}
                    className="form-input"
                  >
                    {densityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="zebraRows"
                    checked={customizer.table.zebraRows}
                    onChange={e => customizer.updateTable({ zebraRows: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="zebraRows" className="text-sm font-medium text-foreground">Zebra Row Striping</label>
                </div>
              </div>
            </div>

            {/* Icons options */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Icons Settings</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Icon Size (px)</label>
                  <input
                    type="number"
                    value={customizer.icon.size}
                    onChange={e => customizer.updateIcon({ size: Number(e.target.value) })}
                    min={12}
                    max={28}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Icon Style</label>
                  <select
                    value={customizer.icon.style}
                    onChange={e => customizer.updateIcon({ style: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="stroke">Stroke Outline</option>
                    <option value="fill">Filled Solid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Icon Color</label>
                  <input
                    type="color"
                    value={customizer.icon.color}
                    onChange={e => customizer.updateIcon({ color: e.target.value })}
                    className="w-full h-10 rounded border border-border p-1 cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Widgets Ordering & Sizing */}
        {activeTab === 'widgets' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Dashboard Widget Setup</h3>
              <p className="text-muted-foreground text-xs">Configure size, visibility and ordering rank of active widgets</p>
            </div>

            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-card">
              {[...customizer.widgetsList]
                .sort((a, b) => a.order - b.order)
                .map((widget, index, arr) => (
                  <div key={widget.id} className="py-3 px-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      {/* Move Order arrows */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveWidget(index, 'up')}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <MoveUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={index === arr.length - 1}
                          onClick={() => moveWidget(index, 'down')}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <MoveDown size={12} />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-semibold capitalize text-foreground">{widget.id.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">Order Rank: {widget.order}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Sizing dropdown */}
                      <select
                        value={widget.size}
                        onChange={e => handleWidgetSize(widget.id, e.target.value as any)}
                        disabled={!widget.visible}
                        className="form-input text-xs w-28 disabled:opacity-50 py-1"
                      >
                        <option value="small">Small Width</option>
                        <option value="medium">Medium Width</option>
                        <option value="large">Full Width</option>
                      </select>

                      {/* Visibility Switch */}
                      <button
                        type="button"
                        onClick={() => handleWidgetToggle(widget.id)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                          widget.visible
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {widget.visible ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppearanceSettings
