<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankAccountResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $business = $this->whenLoaded('business');
        $personal = $this->whenLoaded('personal');

        return [
            'id' => $this->id,

            // Holder
            'holderNameAr' => $this->holder_name_ar,
            'holderNameEn' => $this->holder_name_en,
            'holderIdType' => $this->holder_id_type,
            'holderId' => $this->holder_id,
            // Personal specific
            'dateOfBirth' => $personal?->date_of_birth,
            'ssnLast4' => $personal?->ssn_last_4,

            // Bank
            'bankName' => $this->bank_name,
            'bankCountry' => $this->bank_country,
            'bankAddress' => $this->bank_address,
            'bankPhone' => $this->bank_phone,
            'bankEmail' => $this->bank_email,

            // Account
            'accountNumber' => $this->account_number,
            'iban' => $this->iban,
            'swiftCode' => $this->swift_code,
            'currency' => $this->currency,
            'branchName' => $this->branch_name,
            'branchCode' => $this->branch_code,
            'routingNumber' => $this->routing_number,
            'sortCode' => $this->sort_code,
            'accountType' => $this->account_type,
            'accountCategory' => $this->account_category,

            // Status
            'balance' => $this->balance,
            'status' => $this->status,
            'isDefault' => $this->is_default,
            'isActive' => $this->is_active,

            // Meta
            'notes' => $this->notes,
            'metadata' => $this->metadata,

            // Business-specific (null for personal accounts)
            'establishmentType' => $business?->establishment_type,
            'businessSector' => $business?->business_sector,
            'businessActivity' => $business?->business_activity,
            'commercialRegNumber' => $business?->commercial_reg_number,
            'vatNumber' => $business?->vat_number,
            'authorizedSignatoryName' => $business?->authorized_signatory_name,
            'authorizedSignatoryId' => $business?->authorized_signatory_id,
            'signatoryPosition' => $business?->signatory_position,
            'beneficialOwnershipPercentage' => $business?->beneficial_ownership_percentage,
            'businessName' => $business?->business_name,
            'businessType' => $business?->business_type,
            'taxId' => $business?->tax_id,
            'businessAddress' => $business?->business_address,
            'businessPhone' => $business?->business_phone,

            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
