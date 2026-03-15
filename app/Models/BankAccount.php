<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BankAccount extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'account_number' => 'encrypted',
            'iban' => 'encrypted:deterministic',
            'swift_code' => 'encrypted',
            'holder_id' => 'encrypted',
            'metadata' => 'array',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'balance' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function audits(): MorphMany
    {
        return $this->morphMany(AuditLog::class, 'auditable');
    }

    public function personal(): HasOne
    {
        return $this->hasOne(PersonalBankAccount::class);
    }

    public function business(): HasOne
    {
        return $this->hasOne(BusinessBankAccount::class);
    }

    public function getDetailsAttribute()
    {
        return $this->account_category === 'personal' ? $this->personal : $this->business;
    }

    /**
     * Sync the type-specific detail table for this account.
     * Only personal and business categories are supported.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function syncTypeDetails(array $attributes): void
    {
        // Clean up any stale rows from either table
        PersonalBankAccount::where('bank_account_id', $this->id)->delete();
        BusinessBankAccount::where('bank_account_id', $this->id)->delete();

        if ($this->account_category === 'personal') {
            $data = array_intersect_key($attributes, array_flip([
                'account_holder_name', 'date_of_birth', 'ssn_last_4',
            ]));
            $data['bank_account_id'] = $this->id;
            PersonalBankAccount::create($data);
        }

        if ($this->account_category === 'business') {
            $data = array_intersect_key($attributes, array_flip([
                'business_name', 'business_type', 'tax_id', 'business_address', 'business_phone',
                'establishment_type', 'business_sector', 'business_activity',
                'commercial_reg_number', 'vat_number', 'authorized_signatory_name',
                'authorized_signatory_id', 'signatory_position', 'beneficial_ownership_percentage',
            ]));
            $data['bank_account_id'] = $this->id;
            BusinessBankAccount::create($data);
        }
    }

    /**
     * Update the type-specific detail table without deleting first.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function updateTypeDetails(array $attributes): void
    {
        if ($this->account_category === 'personal') {
            BusinessBankAccount::where('bank_account_id', $this->id)->delete();

            $data = array_intersect_key($attributes, array_flip([
                'account_holder_name', 'date_of_birth', 'ssn_last_4',
            ]));

            if (! empty($data)) {
                $this->personal()->updateOrCreate(
                    ['bank_account_id' => $this->id],
                    $data
                );
            } elseif (! $this->personal()->exists()) {
                // Ensure record exists even if no specific data passed, to maintain consistency
                $this->personal()->create(['bank_account_id' => $this->id]);
            }
        }

        if ($this->account_category === 'business') {
            PersonalBankAccount::where('bank_account_id', $this->id)->delete();

            $data = array_intersect_key($attributes, array_flip([
                'business_name', 'business_type', 'tax_id', 'business_address', 'business_phone',
                'establishment_type', 'business_sector', 'business_activity',
                'commercial_reg_number', 'vat_number', 'authorized_signatory_name',
                'authorized_signatory_id', 'signatory_position', 'beneficial_ownership_percentage',
            ]));

            if (! empty($data)) {
                $this->business()->updateOrCreate(
                    ['bank_account_id' => $this->id],
                    $data
                );
            } elseif (! $this->business()->exists()) {
                $this->business()->create(['bank_account_id' => $this->id]);
            }
        }
    }
}
