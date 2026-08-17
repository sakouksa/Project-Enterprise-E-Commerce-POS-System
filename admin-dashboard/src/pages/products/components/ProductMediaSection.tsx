import React from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Star, Trash2, Image as ImageIcon } from 'lucide-react'
import { getAbsoluteImageUrl } from '@/utils/image'
import type { CreateImagePreview } from '../types/productForm.types'

interface ProductMediaSectionProps {
  isEdit: boolean
  productId: number | null
  productDetail: any
  createImagePreviews: CreateImagePreview[]
  createDragActive: boolean
  handleCreateDrag: (e: React.DragEvent) => void
  handleCreateDrop: (e: React.DragEvent) => void
  handleCreateImageFiles: (files: File[]) => void
  handleRemoveCreateImage: (id: string) => void
  handleSetPrimaryCreateImage: (id: string) => void
  onUpdateImagePrimary?: (imgId: number) => void
  onDeleteImage?: (imgId: number) => void
}

export const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
  isEdit,
  productDetail,
  createImagePreviews,
  createDragActive,
  handleCreateDrag,
  handleCreateDrop,
  handleCreateImageFiles,
  handleRemoveCreateImage,
  handleSetPrimaryCreateImage,
  onUpdateImagePrimary,
  onDeleteImage,
}) => {
  const { t } = useTranslation(['products', 'common'])

  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <ImageIcon size={16} />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-foreground">{t('mediaGallery', 'Product Media Gallery')}</h3>
            <p className="text-[11px] text-muted-foreground">{t('mediaGallerySub', 'Upload product images, set catalog thumbnail or sort order.')}</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
          {createImagePreviews.length + (productDetail?.images?.length || 0)} {t('imagesSelected', 'images selected')}
        </span>
      </div>

      {/* Image Dropzone */}
      <label
        onDragEnter={handleCreateDrag}
        onDragOver={handleCreateDrag}
        onDragLeave={handleCreateDrag}
        onDrop={handleCreateDrop}
        className={`group flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 px-4 text-center cursor-pointer transition-all ${
          createDragActive
            ? 'border-primary bg-primary/10 scale-[1.005]'
            : 'border-border/80 bg-muted/10 hover:border-primary/60 hover:bg-primary/5'
        }`}
      >
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
          <Upload size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">
            {t('dragDropText', 'Drag & drop product images here or click to browse')}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WEBP · Up to 10MB per image</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
              handleCreateImageFiles(Array.from(e.target.files))
            }
          }}
        />
      </label>

      {/* Server Uploaded Photos Grid (In Edit Mode) */}
      {isEdit && productDetail?.images && productDetail.images.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/60 space-y-2.5">
          <span className="text-xs font-bold text-muted-foreground block">{t('uploadedImages', 'Uploaded Photos:')}</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {productDetail.images.map((img: any) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-border bg-muted/20 shadow-xs hover:shadow-md transition-all aspect-square"
              >
                <img
                  src={getAbsoluteImageUrl(img.url || img.image)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt="catalog"
                />
                {img.is_primary && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-primary/95 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md z-10 backdrop-blur-xs">
                    <Star size={10} fill="currentColor" />
                    {t('primaryImage', 'Primary')}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2 z-20">
                  {!img.is_primary && onUpdateImagePrimary && (
                    <button
                      type="button"
                      onClick={() => onUpdateImagePrimary(img.id)}
                      className="p-2 bg-white/90 text-primary hover:bg-primary hover:text-white rounded-xl shadow transition-all cursor-pointer"
                      title={t('setPrimary', 'Set as Primary')}
                    >
                      <Star size={14} />
                    </button>
                  )}
                  {onDeleteImage && (
                    <button
                      type="button"
                      onClick={() => onDeleteImage(img.id)}
                      className="p-2 bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl shadow transition-all cursor-pointer"
                      title={t('delete', 'Delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Image Previews Grid */}
      {createImagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/60">
          {createImagePreviews.map((img) => (
            <div key={img.id} className="relative group rounded-xl border border-border overflow-hidden bg-muted/20 aspect-square shadow-xs hover:shadow-md transition-all">
              <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
              {img.isPrimary && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-primary/95 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 backdrop-blur-xs">
                  <Star size={10} fill="currentColor" />
                  {t('primaryImage', 'Primary')}
                </span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                <button
                  type="button"
                  onClick={() => handleSetPrimaryCreateImage(img.id)}
                  className={`p-2 rounded-xl text-xs font-semibold shadow cursor-pointer ${img.isPrimary ? 'bg-primary text-primary-foreground' : 'bg-white/90 text-foreground hover:bg-white'}`}
                  title={t('setPrimary', 'Set as Primary')}
                >
                  <Star size={14} className={img.isPrimary ? 'fill-current' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveCreateImage(img.id)}
                  className="p-2 rounded-xl bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white shadow cursor-pointer"
                  title={t('delete', 'Delete')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
