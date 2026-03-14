<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessBankAccount extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'tax_id' => 'encrypted',
            'business_address' => 'encrypted',
            'business_phone' => 'encrypted',
            'beneficial_ownership_percentage' => 'float',
        ];
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    public function audits(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(AuditLog::class, 'auditable');
    }
}
