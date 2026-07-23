<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'slug'                => $this->slug,
            'sku'                 => $this->sku,
            'barcode'             => $this->barcode,
            'description'         => $this->description,
            'short_description'   => $this->short_description,
            'cost_price'          => (float) $this->cost_price,
            'selling_price'       => (float) $this->selling_price,
            'compare_price'       => $this->compare_price ? (float) $this->compare_price : null,
            'discount_percent'    => $this->discount_percent,
            'weight'              => $this->weight ? (float) $this->weight : null,
            'has_variants'        => $this->has_variants,
            'track_inventory'     => $this->track_inventory,
            'low_stock_threshold' => $this->low_stock_threshold,
            'status'              => $this->status,
            'is_featured'         => $this->is_featured,
            'is_digital'          => $this->is_digital,
            'sold_count'          => $this->sold_count,
            'view_count'          => $this->view_count,
            'rating_avg'          => (float) $this->rating_avg,
            'rating_count'        => $this->rating_count,
            'length'              => $this->length ? (float) $this->length : null,
            'width'               => $this->width ? (float) $this->width : null,
            'height'              => $this->height ? (float) $this->height : null,
            'meta_title'          => $this->meta_title,
            'meta_description'    => $this->meta_description,
            'meta_keywords'       => $this->meta_keywords,
            'category_id'         => $this->category_id,
            'brand_id'            => $this->brand_id,
            'unit_id'             => $this->unit_id,
            'tax_id'              => $this->tax_id,
            'category'            => $this->whenLoaded('category', fn() => [
                'id'   => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'brand' => $this->whenLoaded('brand', fn() => [
                'id'   => $this->brand?->id,
                'name' => $this->brand?->name,
                'logo' => $this->brand?->logo,
            ]),
            'unit' => $this->whenLoaded('unit', fn() => [
                'id'     => $this->unit?->id,
                'name'   => $this->unit?->name,
                'symbol' => $this->unit?->symbol,
            ]),
            'tax' => $this->whenLoaded('tax', fn() => [
                'id'   => $this->tax?->id,
                'name' => $this->tax?->name,
                'rate' => $this->tax?->rate,
            ]),
            'images'           => $this->whenLoaded('images', fn() => $this->images->map(fn($img) => [
                'id'         => $img->id,
                'url'        => $this->formatImageUrl($img->image),
                'thumb_url'  => $this->formatImageUrl(str_replace('/products/', '/products/thumbs/', $img->image)),
                'is_primary' => (bool) $img->is_primary,
                'sort_order' => $img->sort_order,
            ])),
            'primary_image' => $this->getPrimaryImageUrl(),
            'variants' => $this->whenLoaded('variants', fn() => ProductVariantResource::collection($this->variants)),
            'attributes' => $this->whenLoaded('variants', function() {
                $attrs = [];
                foreach ($this->variants as $variant) {
                    if ($variant->relationLoaded('variantValues')) {
                        foreach ($variant->variantValues as $val) {
                            $attrs[$val->attribute_id] = [
                                'id' => $val->attribute_id,
                                'name' => $val->attribute?->name,
                                'value' => $val->attributeValue?->value,
                            ];
                        }
                    }
                }
                return array_values($attrs);
            }),
            'reviews' => $this->whenLoaded('reviews', fn() => $this->reviews->map(fn($r) => [
                'id' => $r->id,
                'customer_name' => $r->name ?? $r->customer?->name,
                'rating' => $r->rating,
                'title' => $r->title,
                'body' => $r->body,
                'created_at' => $r->created_at?->toIso8601String(),
            ])),
            'stock' => isset($this->stock) ? (float) $this->stock : $this->whenLoaded('inventories', fn() => (float) $this->inventories->sum('quantity')),
            'prices'   => $this->whenLoaded('prices', fn() => $this->prices->map(fn($p) => [
                'id'            => $p->id,
                'price_type'    => $p->price_type,
                'min_qty'       => $p->min_qty,
                'price'         => (float) $p->price,
                'currency_code' => $p->currency_code,
                'start_date'    => $p->start_date?->toDateString(),
                'end_date'      => $p->end_date?->toDateString(),
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    protected function getPrimaryImageUrl(): ?string
    {
        if ($this->relationLoaded('primaryImage') && $this->primaryImage) {
            return $this->formatImageUrl($this->primaryImage->image);
        }
        if ($this->relationLoaded('images') && $this->images && $this->images->count() > 0) {
            $first = $this->images->firstWhere('is_primary', true) ?? $this->images->first();
            return $this->formatImageUrl($first?->image);
        }
        return null;
    }

    protected function formatImageUrl(?string $path): ?string
    {
        if (empty($path)) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        $clean = ltrim($path, '/');
        if (str_starts_with($clean, 'storage/')) {
            return asset($clean);
        }
        return asset('storage/' . $clean);
    }
}
