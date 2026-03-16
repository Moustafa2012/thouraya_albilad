<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case MANAGER = 'manager';
    case USER = 'user';
    case VISITOR = 'visitor';

    /**
     * @return array<UserPermission>
     */
    public function permissions(): array
    {
        return match ($this) {
            self::SUPER_ADMIN => [
                UserPermission::ADMIN_ACCESS,
                UserPermission::MANAGE_USERS,
                UserPermission::MANAGE_CONTENT,
                UserPermission::VIEW_ANALYTICS,
                UserPermission::EXPORT_DATA,
                UserPermission::BILLING_ACCESS,
                UserPermission::SETTINGS_ADVANCED,
                UserPermission::TWO_FACTOR_REQUIRE,
            ],
            self::ADMIN => [
                UserPermission::ADMIN_ACCESS,
                UserPermission::MANAGE_USERS,
                UserPermission::MANAGE_CONTENT,
                UserPermission::VIEW_ANALYTICS,
            ],
            self::MANAGER => [
                UserPermission::ADMIN_ACCESS,
                UserPermission::MANAGE_USERS,
                UserPermission::MANAGE_CONTENT,
                UserPermission::VIEW_ANALYTICS,
            ],
            self::USER => [],
            self::VISITOR => [],
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::ADMIN => 'Admin',
            self::MANAGER => 'Manager',
            self::USER => 'User',
            self::VISITOR => 'Visitor',
        };
    }
}
