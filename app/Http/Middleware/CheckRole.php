<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    private const ROLE_LEVELS = [
        UserRole::VISITOR->value => 0,
        UserRole::USER->value => 1,
        UserRole::MANAGER->value => 2,
        UserRole::ADMIN->value => 3,
        UserRole::SUPER_ADMIN->value => 4,
    ];

    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $required = $roles ?: [UserRole::USER->value];

        $userRole = $user->role instanceof UserRole ? $user->role->value : (string) $user->role;
        $userLevel = self::ROLE_LEVELS[$userRole] ?? 0;

        $minRequired = min(array_map(fn (string $role): int => self::ROLE_LEVELS[$role] ?? 0, $required));

        if ($userLevel < $minRequired) {
            abort(403);
        }

        return $next($request);
    }
}
