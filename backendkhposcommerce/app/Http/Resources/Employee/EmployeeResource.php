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
            'id'                     => $this->id,
            'company_id'             => $this->company_id,
            'branch_id'              => $this->branch_id,
            'department_id'          => $this->department_id,
            'position_id'            => $this->position_id,
            'reporting_to_id'        => $this->reporting_to_id,
            'user_id'                => $this->user_id,
            'employee_number'        => $this->employee_number,
            'name'                   => $this->name,
            'email'                  => $this->email,
            'phone'                  => $this->phone,
            'nik'                    => $this->nik,
            'gender'                 => $this->gender,
            'birth_date'             => $this->birth_date?->format('Y-m-d'),
            'address'                => $this->address,
            'photo'                  => $photoUrl,
            'photo_url'              => $photoUrl,
            'join_date'              => $this->join_date?->format('Y-m-d'),
            'resign_date'            => $this->resign_date?->format('Y-m-d'),
            'contract_type'          => $this->contract_type ?? 'udc',
            'contract_end_date'      => $this->contract_end_date?->format('Y-m-d'),
            'status'                 => $this->status,
            'basic_salary'           => $this->basic_salary,
            // POS & Security
            'pos_pin'                => $this->pos_pin,
            'has_pos_pin'            => !empty($this->pos_pin),
            'card_uid'               => $this->card_uid,
            'sales_commission_rate'  => (float) ($this->sales_commission_rate ?? 0),
            'is_pos_supervisor'      => (bool) $this->is_pos_supervisor,
            'can_override_discount'  => (bool) $this->can_override_discount,
            'can_void_sale'          => (bool) $this->can_void_sale,
            // E-Commerce & Driver
            'is_driver'              => (bool) $this->is_driver,
            'driver_license_no'      => $this->driver_license_no,
            'vehicle_plate_no'       => $this->vehicle_plate_no,
            'driver_status'          => $this->driver_status ?? 'available',
            'is_fulfillment_picker'  => (bool) $this->is_fulfillment_picker,
            // Cambodia Bank & NSSF
            'bank_name'              => $this->bank_name,
            'bank_account_number'    => $this->bank_account_number,
            'bank_account_holder'    => $this->bank_account_holder,
            'nssf_number'            => $this->nssf_number,
            'has_nssf'               => (bool) $this->has_nssf,
            'dependents_count'       => (int) ($this->dependents_count ?? 0),
            // Relationships
            'company'                => $this->company,
            'branch'                 => $this->branch,
            'department'             => $this->department,
            'position'               => $this->position,
            'manager'                => $this->manager ? [
                'id'              => $this->manager->id,
                'name'            => $this->manager->name,
                'employee_number' => $this->manager->employee_number,
            ] : null,
            'user'                   => $this->user,
            'attendance_count'       => $this->attendances_count ?? $this->attendances()->count(),
            'payroll_count'          => $this->payrolls_count ?? $this->payrolls()->count(),
            'leave_requests_count'   => $this->leave_requests_count ?? $this->leaveRequests()->count(),
            'created_at'             => $this->created_at,
            'updated_at'             => $this->updated_at,
        ];
    }
}
