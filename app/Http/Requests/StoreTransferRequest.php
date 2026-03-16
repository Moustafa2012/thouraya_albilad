<?php

namespace App\Http\Requests;

use App\Models\BankAccount;
use App\Models\Beneficiary;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreTransferRequest extends FormRequest
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

            $bankAccountId = $this->integer('bankAccountId');
            $beneficiaryId = $this->integer('beneficiaryId');

            $bankAccount = BankAccount::query()
                ->whereKey($bankAccountId)
                ->where('user_id', $userId)
                ->first();

            if (! $bankAccount) {
                $validator->errors()->add('bankAccountId', 'Invalid bank account selection.');
            } else {
                if (! $bankAccount->is_active || $bankAccount->status !== 'active') {
                    $validator->errors()->add('bankAccountId', 'This bank account is not active.');
                }

                if (! empty($this->input('currency')) && strtoupper((string) $this->input('currency')) === strtoupper((string) $bankAccount->currency)) {
                    $amount = (float) $this->input('amount');
                    if ($amount > 0 && (float) $bankAccount->balance < $amount) {
                        $validator->errors()->add('amount', 'Insufficient balance for this transfer.');
                    }
                }

                if (empty($bankAccount->bank_email)) {
                    $validator->errors()->add('bankAccountId', 'Selected bank account is missing a bank email.');
                }
            }

            $beneficiaryExists = Beneficiary::query()
                ->whereKey($beneficiaryId)
                ->where('user_id', $userId)
                ->exists();

            if (! $beneficiaryExists) {
                $validator->errors()->add('beneficiaryId', 'Invalid beneficiary selection.');
            }
        });
    }
}
