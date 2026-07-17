<?php

namespace App\Infrastructure\Services\Product;

use App\Infrastructure\Repositories\Product\ProductRepository;
use App\Models\Product\Product;
use App\Models\Product\ProductImage;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ProductService
{
    public function __construct(private readonly ProductRepository $productRepository)
    {
    }

    public function getPaginatedProducts(
        array $filters = [],
        int $perPage = 15,
        string $sort = 'created_at',
        string $order = 'desc'
    ): LengthAwarePaginator {
        return $this->productRepository->paginateWithFilters($filters, $perPage, $sort, $order);
    }

    public function getProductById(int $id): Product
    {
        return $this->productRepository->findById(
            $id,
            relations: ['category', 'brand', 'unit', 'tax', 'images', 'variants.variantValues.attribute', 'prices', 'inventories']
        );
    }

    public function createProduct(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            // Auto-generate slug and SKU if not provided
            $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
            $data['sku']  = $data['sku'] ?? $this->generateSku($data['name']);

            // Normalize fields to prevent database type/constraint issues
            $data['company_id'] = $data['company_id'] ?? (auth()->user()?->company_id ?? 1);
            $data['cost_price'] = isset($data['cost_price']) && $data['cost_price'] !== '' ? $data['cost_price'] : 0;
            $data['selling_price'] = isset($data['selling_price']) && $data['selling_price'] !== '' ? $data['selling_price'] : 0;
            $data['compare_price'] = isset($data['compare_price']) && $data['compare_price'] !== '' ? $data['compare_price'] : null;
            $data['weight'] = isset($data['weight']) && $data['weight'] !== '' ? $data['weight'] : null;
            $data['length'] = isset($data['length']) && $data['length'] !== '' ? $data['length'] : null;
            $data['width'] = isset($data['width']) && $data['width'] !== '' ? $data['width'] : null;
            $data['height'] = isset($data['height']) && $data['height'] !== '' ? $data['height'] : null;
            $data['low_stock_threshold'] = isset($data['low_stock_threshold']) && $data['low_stock_threshold'] !== '' ? (int)$data['low_stock_threshold'] : 5;
            $data['has_variants'] = isset($data['has_variants']) ? (bool)$data['has_variants'] : false;
            $data['track_inventory'] = isset($data['track_inventory']) ? (bool)$data['track_inventory'] : true;
            $data['is_featured'] = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
            $data['is_digital'] = isset($data['is_digital']) ? (bool)$data['is_digital'] : false;

            // Extract nested data
            $variants = $data['variants'] ?? [];
            $prices   = $data['prices'] ?? [];
            unset($data['variants'], $data['prices']);

            $product = $this->productRepository->create($data);

            // Create variants
            foreach ($variants as $variantData) {
                $variantData['sku'] = $variantData['sku'] ?? $this->generateSku($product->name . '-' . $variantData['name']);
                $variant = $product->variants()->create($variantData);

                // Attach attribute values
                if (!empty($variantData['attribute_values'])) {
                    foreach ($variantData['attribute_values'] as $attrValueId) {
                        $variant->variantValues()->create([
                            'attribute_value_id' => $attrValueId,
                            'attribute_id'       => \App\Models\Product\AttributeValue::find($attrValueId)?->attribute_id,
                        ]);
                    }
                }
            }

            // Create prices
            foreach ($prices as $priceData) {
                $product->prices()->create($priceData);
            }

            return $product->load(['category', 'brand', 'unit', 'tax', 'images', 'variants', 'prices', 'inventories']);
        });
    }

    public function updateProduct(int $id, array $data): Product
    {
        return DB::transaction(function () use ($id, $data) {
            $prices   = $data['prices'] ?? null;
            unset($data['variants'], $data['prices']);

            if (isset($data['name']) && !isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            // Normalize fields to prevent database type/constraint issues
            if (isset($data['cost_price'])) {
                $data['cost_price'] = $data['cost_price'] !== '' ? $data['cost_price'] : 0;
            }
            if (isset($data['selling_price'])) {
                $data['selling_price'] = $data['selling_price'] !== '' ? $data['selling_price'] : 0;
            }
            if (array_key_exists('compare_price', $data)) {
                $data['compare_price'] = $data['compare_price'] !== '' ? $data['compare_price'] : null;
            }
            if (array_key_exists('weight', $data)) {
                $data['weight'] = $data['weight'] !== '' ? $data['weight'] : null;
            }
            if (array_key_exists('length', $data)) {
                $data['length'] = $data['length'] !== '' ? $data['length'] : null;
            }
            if (array_key_exists('width', $data)) {
                $data['width'] = $data['width'] !== '' ? $data['width'] : null;
            }
            if (array_key_exists('height', $data)) {
                $data['height'] = $data['height'] !== '' ? $data['height'] : null;
            }
            if (isset($data['low_stock_threshold'])) {
                $data['low_stock_threshold'] = $data['low_stock_threshold'] !== '' ? (int)$data['low_stock_threshold'] : 5;
            }
            if (isset($data['has_variants'])) {
                $data['has_variants'] = (bool)$data['has_variants'];
            }
            if (isset($data['track_inventory'])) {
                $data['track_inventory'] = (bool)$data['track_inventory'];
            }
            if (isset($data['is_featured'])) {
                $data['is_featured'] = (bool)$data['is_featured'];
            }
            if (isset($data['is_digital'])) {
                $data['is_digital'] = (bool)$data['is_digital'];
            }

            $product = $this->productRepository->update($id, $data);

            // Sync prices if provided
            if ($prices !== null) {
                $product->prices()->delete();
                foreach ($prices as $priceData) {
                    $product->prices()->create($priceData);
                }
            }

            return $product->load(['category', 'brand', 'unit', 'tax', 'images', 'variants', 'prices', 'inventories']);
        });
    }

    public function deleteProduct(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $product = Product::findOrFail($id);

            // Check if product is linked to any active transaction logs
            $hasTransactions = DB::table('sale_items')->where('product_id', $product->id)->exists()
                || DB::table('purchase_items')->where('product_id', $product->id)->exists()
                || DB::table('order_items')->where('product_id', $product->id)->exists()
                || DB::table('inventory_movements')->where('product_id', $product->id)->exists()
                || DB::table('stock_adjustment_items')->where('product_id', $product->id)->exists()
                || DB::table('stock_opname_items')->where('product_id', $product->id)->exists()
                || DB::table('stock_transfer_items')->where('product_id', $product->id)->exists();

            if ($hasTransactions) {
                throw new \Exception("This product has transaction history and cannot be deleted. Please archive it instead.");
            }

            // Create JSON backup snapshot payload
            $backupPayload = [
                'product' => $product->toArray(),
                'images' => $product->images ? $product->images->toArray() : [],
                'variants' => $product->variants ? $product->variants->toArray() : [],
                'prices' => $product->prices ? $product->prices->toArray() : [],
            ];

            // Log backup data to activity_log table
            \App\Models\Log\ActivityLog::create([
                'log_name' => 'backup_snapshot',
                'description' => "Backup before soft deleting product: {$product->name}",
                'subject_type' => Product::class,
                'subject_id' => $product->id,
                'causer_type' => auth()->user() ? get_class(auth()->user()) : null,
                'causer_id' => auth()->id(),
                'event' => 'deleted',
                'properties' => $backupPayload,
            ]);

            // Soft-delete the product variants
            foreach ($product->variants as $variant) {
                $variant->delete();
            }

            // Soft-delete the product
            return (bool) $product->delete();
        });
    }

    public function restoreProduct(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $product = Product::onlyTrashed()->findOrFail($id);
            $product->restore();

            // Restore variants
            foreach ($product->variants()->onlyTrashed()->get() as $variant) {
                $variant->restore();
            }

            // Log activity
            \App\Models\Log\ActivityLog::create([
                'log_name' => 'backup_snapshot',
                'description' => "Restored product: {$product->name}",
                'subject_type' => Product::class,
                'subject_id' => $product->id,
                'causer_type' => auth()->user() ? get_class(auth()->user()) : null,
                'causer_id' => auth()->id(),
                'event' => 'restored',
            ]);

            return true;
        });
    }

    public function forceDeleteProduct(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $product = Product::withTrashed()->findOrFail($id);

            // Delete physical image files and product_images records
            foreach ($product->images as $image) {
                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }

                // Delete thumbnail
                $thumbPath = str_replace('products/' . $product->id . '/', 'products/' . $product->id . '/thumbs/', $image->image);
                if (Storage::disk('public')->exists($thumbPath)) {
                    Storage::disk('public')->delete($thumbPath);
                }

                $image->delete(); // delete images record
            }

            // Delete product directory to clean up any leftover files
            Storage::disk('public')->deleteDirectory('products/' . $product->id);

            // Delete prices
            $product->prices()->delete();

            // Force delete variants
            foreach ($product->variants()->withTrashed()->get() as $variant) {
                $variant->variantValues()->delete();
                $variant->forceDelete();
            }

            // Log activity
            \App\Models\Log\ActivityLog::create([
                'log_name' => 'backup_snapshot',
                'description' => "Permanently deleted product: {$product->name}",
                'subject_type' => Product::class,
                'subject_id' => $product->id,
                'causer_type' => auth()->user() ? get_class(auth()->user()) : null,
                'causer_id' => auth()->id(),
                'event' => 'force_deleted',
            ]);

            // Force delete the product
            return (bool) $product->forceDelete();
        });
    }

    public function uploadProductImages(int $productId, array $files, int $primaryIndex = 0): array
    {
        $product = $this->productRepository->findById($productId);
        $images  = [];

        foreach ($files as $index => $file) {
            $uploadedHash = md5_file($file->getRealPath());
            $clientName = $file->getClientOriginalName();
            
            // Clean/normalize filename to check for copy patterns (e.g. image1-copy.jpg -> image1)
            $cleanName = preg_replace('/(_copy|-copy|\s*copy)/i', '', pathinfo($clientName, PATHINFO_FILENAME));

            // Prevent duplicate upload (by same hash, same filename, or same product)
            foreach ($product->images as $existingImage) {
                // 1. Same hash check on disk
                if (Storage::disk('public')->exists($existingImage->image)) {
                    $existingFullPath = Storage::disk('public')->path($existingImage->image);
                    if (file_exists($existingFullPath) && md5_file($existingFullPath) === $uploadedHash) {
                        // Skip duplicate hash
                        continue 2;
                    }
                }

                // 2. Same filename / Copy check
                if ($existingImage->alt_text) {
                    $existingCleanName = preg_replace('/(_copy|-copy|\s*copy)/i', '', pathinfo($existingImage->alt_text, PATHINFO_FILENAME));
                    if (strcasecmp($cleanName, $existingCleanName) === 0) {
                        // Skip duplicate filename
                        continue 2;
                    }
                }
            }

            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path      = 'products/' . $productId;

            // Process & optimize image
            $image = Image::read($file)
                ->scaleDown(width: 1200)
                ->toWebp(quality: 85);

            Storage::disk('public')->put($path . '/' . $filename, $image);

            // Create thumbnail
            $thumb = Image::read($file)
                ->cover(300, 300)
                ->toWebp(quality: 80);

            Storage::disk('public')->put($path . '/thumbs/' . $filename, $thumb);

            $productImage = $product->images()->create([
                'image'      => $path . '/' . $filename,
                'alt_text'   => $clientName,
                'sort_order' => $product->images()->count() + $index,
                'is_primary' => $index === $primaryIndex && $product->images()->where('is_primary', true)->doesntExist(),
            ]);

            $images[] = $productImage;
        }

        return $images;
    }

    public function getProductVariants(int $productId): \Illuminate\Database\Eloquent\Collection
    {
        $product = $this->productRepository->findById($productId);

        return $product->variants()->with('variantValues.attribute', 'variantValues.attributeValue')->get();
    }

    private function generateSku(string $name): string
    {
        $base = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $name), 0, 6));
        $rand = strtoupper(Str::random(4));

        return $base . '-' . $rand;
    }
}
