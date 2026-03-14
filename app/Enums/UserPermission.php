<?php

namespace App\Enums;

enum UserPermission: string
{
    case ADMIN_ACCESS = 'admin:access';
    case MANAGE_USERS = 'manage:users';
    case MANAGE_CONTENT = 'manage:content';
    case VIEW_ANALYTICS = 'view:analytics';
    case EXPORT_DATA = 'export:data';
    case BILLING_ACCESS = 'billing:access';
    case SETTINGS_ADVANCED = 'settings:advanced';
    case TWO_FACTOR_REQUIRE = 'two-factor:require';
}
