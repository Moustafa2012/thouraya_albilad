<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLoginHistory extends Model
{
    use HasFactory;

    protected $table = 'user_login_history';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'platform',
        'location',
        'country_code',
        'successful',
        'failure_reason',
        'two_factor_method',
        'two_factor_passed',
        'is_suspicious',
        'login_at',
        'logout_at',
        'session_duration',
    ];

    protected function casts(): array
    {
        return [
            'successful' => 'boolean',
            'two_factor_passed' => 'boolean',
            'is_suspicious' => 'boolean',
            'login_at' => 'datetime',
            'logout_at' => 'datetime',
            'session_duration' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
