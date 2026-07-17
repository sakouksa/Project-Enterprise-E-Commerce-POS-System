<?php

namespace App\Http\Controllers\Api\V1\Log;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $query = Activity::with('causer', 'subject')
            ->when($request->filled('search'), fn($q) =>
                $q->where('description', 'like', "%{$request->search}%")
            )
            ->when($request->filled('causer_type'), fn($q) =>
                $q->where('causer_type', $request->causer_type)
            )
            ->when($request->filled('log_name'), fn($q) =>
                $q->where('log_name', $request->log_name)
            )
            ->when($request->filled('date_from'), fn($q) =>
                $q->whereDate('created_at', '>=', $request->date_from)
            )
            ->when($request->filled('date_to'), fn($q) =>
                $q->whereDate('created_at', '<=', $request->date_to)
            )
            ->latest();

        $logs = $query->paginate($request->get('per_page', 20));

        return $this->paginatedResponse($logs);
    }

    public function show(int $id): JsonResponse
    {
        return $this->successResponse(Activity::with('causer', 'subject')->findOrFail($id));
    }

    public function destroy(int $id): JsonResponse
    {
        Activity::findOrFail($id)->delete();

        return $this->successResponse(null, 'Log entry deleted.');
    }
}
