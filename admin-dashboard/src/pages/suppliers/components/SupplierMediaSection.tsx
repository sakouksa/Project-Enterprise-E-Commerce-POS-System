import React from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Trash2, Image as ImageIcon, CheckCircle2 } from 'lucide-react'

interface SupplierMediaSectionProps {
  logoPreview: string | null
  setLogoPreview: (preview: string | null) => void
  dragActive: boolean
  setDragActive: (active: boolean) => void
}

export const SupplierMediaSection: React.FC<SupplierMediaSectionProps> = ({
  logoPreview,
  setLogoPreview,
  dragActive,
  setDragActive,
}) => {
  const { t } = useTranslation(['suppliers', 'common'])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setLogoPreview(URL.createObjectURL(file))
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        setLogoPreview(URL.createObjectURL(file))
      }
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400">
            <ImageIcon size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">
              {t('suppliers.supplierMedia', 'Supplier Logo & Media')}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {t('suppliers.supplierMediaDesc', 'Upload vendor brand logo, verification stamp or document')}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {logoPreview ? '1 image' : '0 images'}
        </span>
      </div>

      {/* Image Dropzone or Active Preview */}
      {!logoPreview ? (
        <label
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`group flex flex-col items-center justify-center gap-2.5 border-2 border-dashed rounded-2xl py-8 px-4 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-primary bg-primary/10 scale-[1.005]'
              : 'border-border/80 bg-muted/10 hover:border-primary/60 hover:bg-primary/5'
          }`}
        >
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Upload size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              {t('suppliers.dragDropText', 'Drag & drop supplier logo here or click to browse')}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WEBP · Up to 10MB per Image</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/20 aspect-video flex items-center justify-center group">
            <img
              src={logoPreview}
              alt="Supplier Logo Preview"
              className="max-h-full max-w-full object-contain p-2"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setLogoPreview(null)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                title={t('common.delete', 'Remove Logo')}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-lg border border-border shadow-xs flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>{t('suppliers.primaryLogo', 'Primary Logo')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {t('suppliers.logoUploaded', 'Logo loaded successfully')}
            </span>
            <button
              type="button"
              onClick={() => setLogoPreview(null)}
              className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
            >
              {t('common.delete', 'Remove')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
