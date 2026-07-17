<?php

namespace App\Infrastructure\Services\CMS;

use App\Infrastructure\Repositories\CMS\BlogRepository;
use App\Models\CMS\Blog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class BlogService
{
    public function __construct(private readonly BlogRepository $repository)
    {
    }

    public function getAll(array $relations = []): Collection
    {
        return $this->repository->all(relations: $relations);
    }

    public function getPaginated(int $perPage = 15, array $filters = [], array $relations = []): LengthAwarePaginator
    {
        $query = $this->repository->getModel()->newQuery()->with($relations);

        if (isset($filters['status']) && $filters['status'] === 'deleted') {
            $query->onlyTrashed();
        } elseif (isset($filters['status']) && $filters['status'] !== 'deleted') {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage);
    }

    public function getById(int|string $id, array $relations = []): Blog
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): Blog
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Blog
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }

    public function restore(int|string $id): bool
    {
        return $this->repository->restore($id);
    }

    public function forceDelete(int|string $id): bool
    {
        $blog = $this->repository->getModel()->withTrashed()->findOrFail($id);
        
        // Clean physical featured image file if exists
        if ($blog->featured_image && \Illuminate\Support\Facades\Storage::disk('public')->exists($blog->featured_image)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($blog->featured_image);
        }

        return $this->repository->forceDelete($id);
    }
}
