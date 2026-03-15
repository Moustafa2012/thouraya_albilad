<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJournalEntryRequest extends FormRequest
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
            'date' => ['required', 'date'],
            'description' => ['required', 'string', 'max:500'],
            'reference' => ['nullable', 'string', 'max:120'],
            'type' => ['required', 'string', 'in:general,transfer,fee,adjustment'],
            'status' => ['required', 'string', 'in:posted,pending,reversed'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'string', 'max:10'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
