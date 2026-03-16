<?php

namespace App\Http\Requests;

use App\Models\BankAccount;
use App\Models\Beneficiary;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PreviewTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bankAccountId' => ['required', 'integer'],
            'beneficiaryId' => ['required', 'integer'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'string', 'size:3'],
            'transferDate' => ['required', 'date'],
            'referenceNumber' => ['required', 'string', 'max:80'],
            'notes' => ['required', 'string', 'max:5000'],
            'authorizedBy' => ['required', 'string', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $userId = $this->user()?->id;
            if (! $userId) {
                $validator->errors()->add('bankAccountId', 'Unauthorized.');

                return;
            }

            $bankAccountExists = BankAccount::query()
                ->whereKey($this->integer('bankAccountId'))
                ->where('user_id', $userId)
                ->exists();

            if (! $bankAccountExists) {
                $validator->errors()->add('bankAccountId', 'Invalid bank account selection.');
            }

            $beneficiaryExists = Beneficiary::query()
                ->whereKey($this->integer('beneficiaryId'))
                ->where('user_id', $userId)
                ->exists();

            if (! $beneficiaryExists) {
                $validator->errors()->add('beneficiaryId', 'Invalid beneficiary selection.');
            }
        });
    }
}
