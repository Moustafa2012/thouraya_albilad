<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonalBankAccount extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'encrypted:date',
            'ssn_last_4' => 'encrypted',
            'account_holder_name' => 'encrypted',
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
