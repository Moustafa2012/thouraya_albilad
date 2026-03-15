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
            'account_name' => ['nullable', 'string', 'max:255'],

            'account_category' => ['required', 'string', 'in:personal,business'],
            'account_type' => ['required', 'string', 'max:255'],
            'currency' => ['required', 'string', 'size:3'],

            'holder_name_ar' => ['required', 'string', 'max:255'],
            'holder_name_en' => ['required', 'string', 'max:255'],
            'holder_id_type' => ['nullable', 'string', 'max:255'],
            'holder_id' => ['nullable', 'string', 'max:255'],

            'bank_name' => ['required', 'string', 'max:255'],
            'bank_country' => ['nullable', 'string', 'max:255'],
            'bank_address' => ['nullable', 'string', 'max:255'],
            'bank_phone' => ['nullable', 'string', 'max:255'],
            'bank_email' => ['nullable', 'email', 'max:255'],

            'account_number' => ['required', 'string', 'max:255'],
            'iban' => ['required', 'string', 'max:34', 'unique:bank_accounts,iban'],
            'swift_code' => ['nullable', 'string', 'max:11'],
            'branch_name' => ['nullable', 'string', 'max:255'],
            'branch_code' => ['nullable', 'string', 'max:255'],
            'routing_number' => ['nullable', 'string', 'max:255'],
            'sort_code' => ['nullable', 'string', 'max:255'],

            'balance' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:active,inactive,suspended'],
            'is_default' => ['boolean'],
            'is_active' => ['boolean'],

            'notes' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],

            // Personal Specific
            'account_holder_name' => ['required_if:account_category,personal', 'nullable', 'string', 'max:255'],
            'date_of_birth' => ['required_if:account_category,personal', 'nullable', 'date'],
            'ssn_last_4' => ['required_if:account_category,personal', 'nullable', 'string', 'size:4'],

            // Business Specific
            'business_name' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'business_type' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'tax_id' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'business_address' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'business_phone' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'establishment_type' => ['required_if:account_category,business', 'nullable', 'string', 'max:100'],
            'business_sector' => ['required_if:account_category,business', 'nullable', 'string', 'max:150'],
            'business_activity' => ['nullable', 'string'],
            'commercial_reg_number' => ['required_if:account_category,business', 'nullable', 'string', 'max:20'],
            'vat_number' => ['nullable', 'string', 'max:20'],
            'authorized_signatory_name' => ['required_if:account_category,business', 'nullable', 'string', 'max:255'],
            'authorized_signatory_id' => ['required_if:account_category,business', 'nullable', 'string', 'max:50'],
            'signatory_position' => ['required_if:account_category,business', 'nullable', 'string', 'max:150'],
            'beneficial_ownership_percentage' => ['required_if:account_category,business', 'nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tax_id.required_if' => 'Business tax ID required.',
            'ssn_last_4.size' => 'SSN Last 4 must be exactly 4 digits.',
        ];
    }
}
