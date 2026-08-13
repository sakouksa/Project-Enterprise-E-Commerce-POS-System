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
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400">
            <ImageIcon size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{t('products.mediaGallery', 'Product Media & Gallery')}</h3>
            <p className="text-[11px] text-muted-foreground">{t('products.mediaGallerySub', 'Upload high-resolution product photos')}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
          {createImagePreviews.length + (productDetail?.images?.length || 0)} {t('products.imagesSelected', 'images')}
        </span>
      </div>

      {/* Image Dropzone */}
      <label
        onDragEnter={handleCreateDrag}
        onDragOver={handleCreateDrag}
        onDragLeave={handleCreateDrag}
        onDrop={handleCreateDrop}
        className={`group flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-7 px-4 text-center cursor-pointer transition-all ${
          createDragActive
            ? 'border-primary bg-primary/10 scale-[1.005]'
            : 'border-border/80 bg-muted/10 hover:border-primary/60 hover:bg-primary/5'
        }`}
      >
        <Upload className="text-muted-foreground/60 group-hover:text-primary transition-colors" size={24} />
        <div>
          <p className="text-xs font-semibold text-foreground">
            {t('products.dragDropText', 'Drag & drop product images here, or click to browse')}
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
        <div className="mt-4 pt-4 border-t border-border/60 space-y-2">
          <span className="text-xs font-semibold text-muted-foreground block">{t('products.uploadedImages', 'Uploaded Photos:')}</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {productDetail.images.map((img: any) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-border/60 bg-muted/10 shadow-xs hover:shadow-md transition-all aspect-square"
              >
                <img
                  src={getAbsoluteImageUrl(img.url || img.image)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt="catalog"
                />
                {img.is_primary && (
                  <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold shadow-xs">
                    <Star size={9} fill="currentColor" />
                    {t('products.primaryImage', 'Primary')}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
                  {!img.is_primary && onUpdateImagePrimary && (
                    <button
                      type="button"
                      onClick={() => onUpdateImagePrimary(img.id)}
                      className="p-1.5 bg-white text-primary hover:bg-primary hover:text-primary-foreground rounded-lg shadow transition-all cursor-pointer"
                      title={t('products.setPrimary', 'Set as Primary')}
                    >
                      <Star size={13} />
                    </button>
                  )}
                  {onDeleteImage && (
                    <button
                      type="button"
                      onClick={() => onDeleteImage(img.id)}
                      className="p-1.5 bg-white text-red-600 hover:bg-red-600 hover:text-white rounded-lg shadow transition-all cursor-pointer"
                      title={t('common.delete', 'Delete')}
                    >
                      <Trash2 size={13} />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
          {createImagePreviews.map((img) => (
            <div key={img.id} className="relative group rounded-xl border border-border overflow-hidden bg-muted/20 aspect-square">
              <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => handleSetPrimaryCreateImage(img.id)}
                  className={`p-1.5 rounded-lg text-xs font-semibold ${img.isPrimary ? 'bg-amber-500 text-white' : 'bg-white/80 text-foreground hover:bg-white'}`}
                  title={t('products.setPrimary', 'Set as Primary')}
                >
                  <Star size={13} className={img.isPrimary ? 'fill-white' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveCreateImage(img.id)}
                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  title={t('common.delete', 'Delete')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {img.isPrimary && (
                <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                  {t('products.primaryImage', 'Primary')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
