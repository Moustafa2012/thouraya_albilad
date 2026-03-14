<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Beneficiary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'account_type',
        'name_ar',
        'name_en',
        'national_id',
        'business_registration',
        'tax_id',
        'email',
        'phone',
        'address',
        'country',
        'bank_name',
        'account_number',
        'iban',
        'swift_code',
        'currency',
        'aba_number',
        'routing_number',
        'ifsc_code',
        'sort_code',
        'bsb_number',
        'transit_number',
        'category',
        'notes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
