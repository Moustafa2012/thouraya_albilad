<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserPermission;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'phone',
        'avatar',
        'date_of_birth',
        'gender',
        'nationality',
        'timezone',
        'locale',
        'bio',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'role',
        'permissions',
        'is_active',
        'is_banned',
        'ban_reason',
        'banned_at',
        'banned_by',
        'is_super_admin',
        'last_login_at',
        'last_login_ip',
        'last_login_user_agent',
        'last_login_device',
        'last_login_location',
        'login_attempts',
        'locked_until',
        'password_changed_at',
        'force_password_change',
        'two_factor_enabled',
        'phone_verified_at',
        'email_verification_token',
        'phone_verification_token',
        'email_verification_sent_at',
        'phone_verification_sent_at',
        'company_id',
        'department_id',
        'job_title',
        'salary',
        'hired_at',
        'created_by',
        'updated_by',
        'created_ip',
        'updated_ip',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'email_verification_token',
        'phone_verification_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'email_verification_sent_at' => 'datetime',
            'phone_verification_sent_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'two_factor_enabled' => 'boolean',
            'force_password_change' => 'boolean',
            'role' => UserRole::class,
            'permissions' => 'array',
            'is_active' => 'boolean',
            'is_banned' => 'boolean',
            'is_super_admin' => 'boolean',
            'last_login_at' => 'datetime',
            'locked_until' => 'datetime',
            'password_changed_at' => 'datetime',
            'date_of_birth' => 'date',
            'hired_at' => 'date',
            'salary' => 'decimal:2',
            'deleted_at' => 'datetime',
        ];
    }

    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }

    public function transfers()
    {
        return $this->hasMany(Transfer::class);
    }

    public function loginHistory()
    {
        return $this->hasMany(UserLoginHistory::class);
    }

    public function sessions()
    {
        return $this->hasMany(Session::class);
    }

    public function deviceTokens()
    {
        return $this->hasMany(UserDeviceToken::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(UserActivityLog::class);
    }

    public function hasRole(UserRole|string $role): bool
    {
        if (is_string($role)) {
            return $this->role->value === $role;
        }

        return $this->role === $role;
    }

    public function hasPermission(UserPermission|string $permission): bool
    {
        $targetPermission = is_string($permission)
            ? UserPermission::tryFrom($permission)
            : $permission;

        if (! $targetPermission) {
            return false;
        }

        if ($this->is_super_admin || $this->role === UserRole::SUPER_ADMIN) {
            return true;
        }

        $rolePermissions = $this->role->permissions();

        if (in_array($targetPermission, $rolePermissions, true)) {
            return true;
        }

        $customPermissions = $this->permissions ?? [];

        if (in_array($targetPermission->value, $customPermissions, true)) {
            return true;
        }

        return false;
    }
}
