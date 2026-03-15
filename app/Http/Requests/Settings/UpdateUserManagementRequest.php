<?php

namespace App\Http\Requests\Settings;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserManagementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage:users') ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'role' => ['nullable', 'string', Rule::in(array_map(fn (UserRole $r) => $r->value, UserRole::cases()))],
            'is_active' => ['nullable', 'boolean'],
            'is_banned' => ['nullable', 'boolean'],
            'ban_reason' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
