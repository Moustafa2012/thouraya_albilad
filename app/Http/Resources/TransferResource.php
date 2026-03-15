<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Transfer
 */
class TransferResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'bankAccountId' => (string) $this->bank_account_id,
            'beneficiaryId' => (string) $this->beneficiary_id,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'transferDate' => $this->transfer_date?->toDateString(),
            'referenceNumber' => $this->reference_number,
            'notes' => $this->notes,
            'bankEmail' => $this->bank_email,
            'status' => $this->status,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'bankAccount' => $this->whenLoaded('bankAccount', function () {
                return [
                    'id' => (string) $this->bankAccount->id,
                    'bankName' => $this->bankAccount->bank_name,
                    'iban' => $this->bankAccount->iban,
                    'currency' => $this->bankAccount->currency,
                    'balance' => (float) $this->bankAccount->balance,
                    'bankEmail' => $this->bankAccount->bank_email,
                ];
            }),
            'beneficiary' => $this->whenLoaded('beneficiary', function () {
                return [
                    'id' => (string) $this->beneficiary->id,
                    'nameAr' => $this->beneficiary->name_ar,
                    'nameEn' => $this->beneficiary->name_en,
                    'bankName' => $this->beneficiary->bank_name,
                    'iban' => $this->beneficiary->iban,
                    'currency' => $this->beneficiary->currency,
                ];
            }),
        ];
    }
}
