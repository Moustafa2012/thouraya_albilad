<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBankAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('bank_account')?->id;

        return [
            'account_name' => ['sometimes', 'nullable', 'string', 'max:255'],

            // Holder Details
            'holder_name_ar' => ['sometimes', 'required', 'string', 'max:255'],
            'holder_name_en' => ['sometimes', 'required', 'string', 'max:255'],
            'holder_id_type' => ['nullable', 'string', 'max:255'],
            'holder_id' => ['nullable', 'string', 'max:255'],

            // Bank Details
            'bank_name' => ['sometimes', 'required', 'string', 'max:255'],
            'bank_country' => ['nullable', 'string', 'max:255'],
            'bank_address' => ['nullable', 'string', 'max:255'],
            'bank_phone' => ['nullable', 'string', 'max:255'],
            'bank_email' => ['nullable', 'email', 'max:255'],

            // Account Details
            'account_number' => ['sometimes', 'required', 'string', 'max:255'],
            'iban' => ['sometimes', 'required', 'string', 'max:34', Rule::unique('bank_accounts', 'iban')->ignore($id)],
            'swift_code' => ['nullable', 'string', 'max:11'],
            'currency' => ['sometimes', 'required', 'string', 'size:3'],
            'branch_name' => ['nullable', 'string', 'max:255'],
            'branch_code' => ['nullable', 'string', 'max:255'],
            'routing_number' => ['nullable', 'string', 'max:255'],
            'sort_code' => ['nullable', 'string', 'max:255'],

            // Classification
            'account_type' => ['sometimes', 'required', 'string', 'max:255'],
            'account_category' => ['sometimes', 'required', 'string', 'in:personal,business'],

            // Status & Flags
            'balance' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', 'string', 'in:active,suspended,inactive'],
            'is_default' => ['boolean'],
            'is_active' => ['boolean'],

            // Metadata
            'notes' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],

            // Type specific fields
            // Personal
            'account_holder_name' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'ssn_last_4' => ['nullable', 'string', 'size:4'],

            // Business
            'business_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:255'],
            'business_address' => ['nullable', 'string', 'max:255'],
            'business_phone' => ['nullable', 'string', 'max:255'],

            'establishment_type' => ['nullable', 'string', 'max:100'],
            'business_sector' => ['nullable', 'string', 'max:150'],
            'business_activity' => ['nullable', 'string'],
            'commercial_reg_number' => ['nullable', 'string', 'max:20'],
            'vat_number' => ['nullable', 'string', 'max:20'],
            'authorized_signatory_name' => ['nullable', 'string', 'max:255'],
            'authorized_signatory_id' => ['nullable', 'string', 'max:50'],
            'signatory_position' => ['nullable', 'string', 'max:150'],
            'beneficial_ownership_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
        ];
    }
}
