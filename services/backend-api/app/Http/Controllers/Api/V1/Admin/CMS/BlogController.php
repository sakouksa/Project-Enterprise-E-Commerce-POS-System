<?php

namespace App\Http\Controllers\Api\V1\Admin\CMS;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\CMS\CreateBlogRequest;
use App\Http\Requests\CMS\UpdateBlogRequest;
use App\Http\Resources\CMS\BlogResource;
use App\Services\CMS\BlogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends BaseApiController
{
    public function __construct(private readonly BlogService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated(
            $request->integer('per_page', 10),
            $request->only(['search', 'status']),
            ['category', 'author', 'tags']
        );
        
        $resourceCollection = BlogResource::collection($records);
        
        return response()->json([
            'success'    => true,
            'message'    => 'Success',
            'data'       => $resourceCollection->resolve(),
            'pagination' => [
                'total'        => $records->total(),
                'per_page'     => $records->perPage(),
                'current_page' => $records->currentPage(),
                'last_page'    => $records->lastPage(),
                'from'         => $records->firstItem(),
                'to'           => $records->lastItem(),
            ],
        ]);
    }

    public function store(CreateBlogRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new BlogResource($record),
            'Blog created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id, ['category', 'author', 'tags']);
        return $this->successResponse(
            new BlogResource($record),
            'Blog details retrieved successfully'
        );
    }

    public function update(UpdateBlogRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new BlogResource($record),
            'Blog updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->delete($id);
            return $this->successResponse(null, 'Blog deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        if (empty($ids) || !is_array($ids)) {
            return $this->errorResponse('No IDs provided', 422);
        }

        try {
            $count = $this->service->bulkDelete($ids);
            return $this->successResponse(['deleted_count' => $count], "Successfully deleted {$count} blogs");
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function restore(int $id): JsonResponse
    {
        try {
            $this->service->restore($id);
            return $this->successResponse(null, 'Blog restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function forceDelete(int $id): JsonResponse
    {
        try {
            $this->service->forceDelete($id);
            return $this->successResponse(null, 'Blog permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function stats(): JsonResponse
    {
        $totalBlogs = \App\Models\CMS\Blog::count();
        $publishedBlogs = \App\Models\CMS\Blog::where('status', 'published')->count();
        $draftBlogs = \App\Models\CMS\Blog::where('status', 'draft')->count();
        $archivedBlogs = \App\Models\CMS\Blog::where('status', 'archived')->count();
        $todayBlogs = \App\Models\CMS\Blog::whereDate('created_at', today())->count();
        $totalViews = (int) \App\Models\CMS\Blog::sum('view_count');
        $blogsWithImage = \App\Models\CMS\Blog::whereNotNull('featured_image')->where('featured_image', '!=', '')->count();

        $totalCategories = \App\Models\CMS\BlogCategory::count();
        $activeCategories = \App\Models\CMS\BlogCategory::where('is_active', 1)->count();
        $inactiveCategories = $totalCategories - $activeCategories;
        $categoriesWithDesc = \App\Models\CMS\BlogCategory::whereNotNull('description')->where('description', '!=', '')->count();

        $totalTags = \App\Models\CMS\BlogTag::count();

        $totalPages = \App\Models\CMS\Page::count();
        $publishedPages = \App\Models\CMS\Page::where('status', 'published')->count();
        $draftPages = \App\Models\CMS\Page::where('status', '!=', 'published')->count();
        $pagesWithSeo = \App\Models\CMS\Page::where(function($q) {
            $q->whereNotNull('meta_title')->where('meta_title', '!=', '')
              ->orWhere(function($q2) {
                  $q2->whereNotNull('meta_description')->where('meta_description', '!=', '');
              });
        })->count();

        $totalFaqs = \App\Models\CMS\Faq::count();
        $activeFaqs = \App\Models\CMS\Faq::where('is_active', 1)->count();
        $inactiveFaqs = $totalFaqs - $activeFaqs;
        $faqCategoriesCount = \App\Models\CMS\Faq::distinct('category')->whereNotNull('category')->where('category', '!=', '')->count('category');

        return $this->successResponse([
            'blogs' => [
                'total' => $totalBlogs,
                'published' => $publishedBlogs,
                'draft' => $draftBlogs,
                'archived' => $archivedBlogs,
                'today' => $todayBlogs,
                'total_views' => $totalViews,
                'with_images' => $blogsWithImage,
            ],
            'categories' => [
                'total' => $totalCategories,
                'active' => $activeCategories,
                'inactive' => $inactiveCategories,
                'with_description' => $categoriesWithDesc,
            ],
            'tags' => [
                'total' => $totalTags,
            ],
            'pages' => [
                'total' => $totalPages,
                'published' => $publishedPages,
                'draft' => $draftPages,
                'with_seo' => $pagesWithSeo,
            ],
            'faqs' => [
                'total' => $totalFaqs,
                'active' => $activeFaqs,
                'inactive' => $inactiveFaqs,
                'categories_count' => $faqCategoriesCount,
            ],
        ], 'CMS stats retrieved successfully');
    }
}
