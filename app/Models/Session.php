<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sessions';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'ip_address',
        'user_agent',
        'payload',
        'device_name',
        'device_type',
        'browser',
        'browser_version',
        'platform',
        'platform_version',
        'is_robot',
        'location',
        'country_code',
        'last_activity',
        'last_used_at',
        'created_at',
        'expires_at',
        'is_current',
        'trusted_device',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_activity' => 'integer',
            'last_used_at' => 'datetime',
            'created_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_robot' => 'boolean',
            'is_current' => 'boolean',
            'trusted_device' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the session.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
