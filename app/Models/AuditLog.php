<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected static function booted(): void
    {
        static::creating(function (AuditLog $log): void {
            if (! empty($log->severity)) {
                return;
            }

            $action = (string) ($log->action ?? '');
            $log->severity = match (true) {
                str_contains($action, 'delete') || str_contains($action, 'suspend') || str_contains($action, 'lock') || str_contains($action, 'ban') || str_contains($action, 'revoke') => 'critical',
                str_contains($action, 'failed') || str_contains($action, 'suspicious') || str_contains($action, 'denied') || str_contains($action, 'blocked') => 'warning',
                default => 'info',
            };
        });
    }

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
