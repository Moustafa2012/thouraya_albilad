<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Common Fields
            'account_name' => ['nullable', 'string', 'max:255'],
            'account_category' => ['required', 'string', 'in:personal,business'],
            'account_type' => ['required', 'string', 'max:50'], // current, savings, etc.
            'currency' => ['required', 'string', 'size:3'],
            'account_number' => ['required', 'string', 'max:50'],
            'routing_number' => ['nullable', 'string', 'max:50', 'regex:/^\d{9}$/'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:active,inactive,suspended'],

            // Legacy/Bank Fields (still needed for DB?)
            'holder_name_ar' => ['nullable', 'string', 'max:255'],
            'holder_name_en' => ['nullable', 'string', 'max:255'],
            'bank_name' => ['required', 'string', 'max:255'],
            'iban' => ['nullable', 'string', 'max:34', 'unique:bank_accounts,iban'],
            'swift_code' => ['nullable', 'string', 'max:11'],
            'bank_address' => ['nullable', 'string', 'max:255'],

            // Personal Specific
            'account_holder_name' => ['required_if:account_category,personal', 'nullable', 'string', 'max:255'],
            'date_of_birth' => ['required_if:account_category,personal', 'nullable', 'date'],
            'ssn_last_4' => ['required_if:account_category,personal', 'nullable', 'string', 'size:4'],

            // Business Specific
            'business_name' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'business_type' => ['required_if:account_category,business', 'nullable', 'string', 'max:100'],
            'tax_id' => ['required_if:account_category,business', 'nullable', 'string', 'max:50'],
            'business_address' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'business_phone' => ['required_if:account_category,business', 'nullable', 'string', 'max:50'],
            'establishment_type' => ['required_if:account_category,business', 'nullable', 'string', 'max:100'],
            'business_sector' => ['required_if:account_category,business', 'nullable', 'string', 'max:100'],
            'business_activity' => ['nullable', 'string', 'max:500'],
            'commercial_reg_number' => ['required_if:account_category,business', 'nullable', 'string', 'max:50'],
            'vat_number' => ['nullable', 'string', 'max:50'],
            'authorized_signatory_name' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'authorized_signatory_id' => ['required_if:account_category,business', 'nullable', 'string', 'max:50'],
            'signatory_position' => ['required_if:account_category,business', 'nullable', 'string', 'max:100'],
            'beneficial_ownership_percentage' => ['required_if:account_category,business', 'nullable', 'numeric', 'min:0', 'max:100'],

            // Additional
            'is_default' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'routing_number.required' => 'Routing number is required.',
            'routing_number.regex' => 'Invalid routing number format',
            'tax_id.required_if' => 'Business tax ID required.',
            'ssn_last_4.size' => 'SSN Last 4 must be exactly 4 digits.',
        ];
    }
}
