<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\JournalEntry
 */
class JournalEntryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'date' => $this->date?->toDateString(),
            'description' => $this->description,
            'reference' => $this->reference,
            'type' => $this->type,
            'status' => $this->status,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
        ];
    }
}
