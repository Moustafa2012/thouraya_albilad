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
            $month = is_string($transferDate) ? substr($transferDate, 5, 2) : $transferDate->format('m');

            $transfer->transfer_number = static::nextTransferNumber($year, $month);
        });
    }

    /**
     * Generate next transfer number for the given month: TR-YYYY-MM-{3-DIGIT-SEQUENCE}.
     */
    public static function nextTransferNumber(?string $year = null, ?string $month = null): string
    {
        $year = $year ?? (string) date('Y');
        $month = $month ?? (string) date('m');
        $prefix = "TR-{$year}-{$month}-";

        $last = static::query()
            ->where('transfer_number', 'like', $prefix.'%')
            ->orderByDesc('transfer_number')
            ->lockForUpdate()
            ->value('transfer_number');

        $seq = 1;
        if ($last && preg_match('/^TR-\d{4}-\d{2}-(\d+)$/', $last, $m)) {
            $seq = (int) $m[1] + 1;
        }

        return $prefix.sprintf('%03d', $seq);
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
