<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBeneficiaryRequest extends FormRequest
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
        return [
            'accountType' => ['required', 'string', 'in:individual,business'],
            'nameAr' => ['required', 'string', 'max:255'],
            'nameEn' => ['required', 'string', 'max:255'],
            'nationalId' => ['nullable', 'string', 'max:255'],
            'businessRegistration' => ['nullable', 'string', 'max:255'],
            'taxId' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'country' => ['required', 'string', 'max:2'],
            'bankName' => ['required', 'string', 'max:255'],
            'accountNumber' => ['required', 'string', 'max:255'],
            'iban' => ['required', 'string', 'max:255'],
            'swiftCode' => ['required', 'string', 'max:255'],
            'currency' => ['required', 'string', 'max:3'],
            'abaNumber' => ['nullable', 'string', 'max:255'],
            'routingNumber' => ['nullable', 'string', 'max:255'],
            'ifscCode' => ['nullable', 'string', 'max:255'],
            'sortCode' => ['nullable', 'string', 'max:255'],
            'bsbNumber' => ['nullable', 'string', 'max:255'],
            'transitNumber' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:suppliers,employees,partners,contractors,other'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
