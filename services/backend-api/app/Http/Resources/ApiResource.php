<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ApiResource extends JsonResource
{
    protected string $message;

    public function __construct($resource, string $message = 'Success')
    {
        parent::__construct($resource);
        $this->message = $message;
    }

    public function with($request): array
    {
        return [
            'message' => $this->message,
        ];
    }
}
