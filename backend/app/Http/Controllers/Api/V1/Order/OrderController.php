<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Controllers\Api\BaseApiController;
use App\Domain\Contracts\Repositories\Order\OrderRepositoryInterface;
use App\Infrastructure\Services\Order\OrderService;
use App\Http\Requests\Order\ShipOrderRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends BaseApiController
{
    protected OrderRepositoryInterface $orderRepository;
    protected OrderService $orderService;

    public function __construct(
        OrderRepositoryInterface $orderRepository,
        OrderService $orderService
    ) {
        $this->orderRepository = $orderRepository;
        $this->orderService = $orderService;
    }

    /**
     * GET /api/v1/orders
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->search;
        $orders = $this->orderRepository->paginate(
            $request->integer('per_page', 15),
            ['*'],
            ['customer']
        );

        return $this->paginatedResponse($orders);
    }

    /**
     * GET /api/v1/orders/{id}
     */
    public function show(int $id): JsonResponse
    {
        $order = $this->orderRepository->findById(
            $id,
            ['*'],
            ['customer', 'items.product', 'statusHistories.user']
        );
        return $this->successResponse($order);
    }

    /**
     * POST /api/v1/orders/{id}/confirm
     */
    public function confirm(int $id): JsonResponse
    {
        $order = $this->orderService->confirm($id);
        return $this->successResponse($order, 'Order confirmed successfully');
    }

    /**
     * POST /api/v1/orders/{id}/ship
     */
    public function ship(ShipOrderRequest $request, int $id): JsonResponse
    {
        $order = $this->orderService->ship(
            $id,
            $request->input('carrier'),
            $request->input('tracking_number')
        );

        return $this->successResponse($order, 'Order shipped successfully');
    }

    /**
     * POST /api/v1/orders/{id}/complete
     */
    public function complete(int $id): JsonResponse
    {
        $order = $this->orderService->complete($id);
        return $this->successResponse($order, 'Order completed successfully');
    }

    /**
     * POST /api/v1/orders/{id}/cancel
     */
    public function cancel(int $id): JsonResponse
    {
        $order = $this->orderService->cancel($id);
        return $this->successResponse($order, 'Order cancelled successfully');
    }
}
