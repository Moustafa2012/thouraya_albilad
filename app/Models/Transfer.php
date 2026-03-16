<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transfer extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected static function booted(): void
    {
        static::creating(function (Transfer $transfer): void {
            if (! empty($transfer->transfer_number)) {
                return;
            }

            $transferDate = $transfer->transfer_date ?? now();
            $year = is_string($transferDate) ? substr($transferDate, 0, 4) : $transferDate->format('Y');

            $transfer->transfer_number = static::nextTransferNumber($year);
        });
    }

    /**
     * Generate next transfer number for the given year: TBT-{YEAR}-{4-DIGIT-SEQUENCE}.
     */
    public static function nextTransferNumber(?string $year = null): string
    {
        $year = $year ?? (string) date('Y');
        $prefix = "TBT-{$year}-";

        $last = static::query()
            ->where('transfer_number', 'like', $prefix.'%')
            ->orderByDesc('transfer_number')
            ->lockForUpdate()
            ->value('transfer_number');

        $seq = 1;
        if ($last && preg_match('/^TBT-\d{4}-(\d+)$/', $last, $m)) {
            $seq = (int) $m[1] + 1;
        }

        return $prefix.sprintf('%04d', $seq);
    }

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transfer_date' => 'date',
            'sent_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    public function beneficiary(): BelongsTo
    {
        return $this->belongsTo(Beneficiary::class);
    }
}
