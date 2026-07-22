<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'username' => trim($this->input('username', $this->input('identifier', $this->input('email', '')))),
            'password' => $this->input('password', ''),
        ]);
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|min:2|max:100',
            'password' => 'required|string|min:6|max:128',
            'remember' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Username is required.',
            'username.min'      => 'Username must be at least 2 characters.',
            'password.required' => 'Password is required.',
            'password.min'      => 'Password must be at least 6 characters.',
        ];
    }
}
