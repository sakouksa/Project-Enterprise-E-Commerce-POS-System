<?php

namespace App\Http\Resources\Employee;

use App\Http\Resources\Traits\FormatsMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    use FormatsMediaUrl;

    public function toArray(Request $request): array
    {
        $photoUrl = $this->formatMediaUrl($this->photo);

        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'branch_id' => $this->branch_id,
            'department_id' => $this->department_id,
            'position_id' => $this->position_id,
            'user_id' => $this->user_id,
            'employee_number' => $this->employee_number,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'nik' => $this->nik,
            'gender' => $this->gender,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'address' => $this->address,
            'photo' => $photoUrl,
            'photo_url' => $photoUrl,
            'join_date' => $this->join_date?->format('Y-m-d'),
            'resign_date' => $this->resign_date?->format('Y-m-d'),
            'status' => $this->status,
            'basic_salary' => $this->basic_salary,
            'company' => $this->company,
            'branch' => $this->branch,
            'department' => $this->department,
            'position' => $this->position,
            'user' => $this->user,
            'attendance_count' => $this->attendances_count ?? $this->attendances()->count(),
            'payroll_count' => $this->payrolls_count ?? $this->payrolls()->count(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
