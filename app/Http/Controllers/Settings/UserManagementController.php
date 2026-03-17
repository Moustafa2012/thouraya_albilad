<?php

namespace App\Http\Controllers\Settings;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateUserManagementRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('manage:users'), 403);

        $users = User::query()
            ->withTrashed(false)
            ->latest()
            ->get([
                'id',
                'name',
                'username',
                'email',
                'role',
                'is_active',
                'is_banned',
                'ban_reason',
                'banned_at',
                'email_verified_at',
                'last_login_at',
                'last_login_ip',
                'login_attempts',
                'locked_until',
                'created_at',
            ]);

        return Inertia::render('settings/users', [
            'users' => $users,
            'roles' => array_map(fn (UserRole $r) => $r->value, UserRole::cases()),
        ]);
    }

    public function update(UpdateUserManagementRequest $request, User $managedUser): RedirectResponse
    {
        abort_unless($request->user()->can('manage:users'), 403);

        if ($managedUser->id === $request->user()->id) {
            return back()->with('error', 'You cannot modify your own account from this screen.');
        }

        $data = $request->validated();

        // Only super admins can assign the Super Admin role
        if (
            array_key_exists('role', $data) &&
            $data['role'] === UserRole::SUPER_ADMIN->value &&
            ! $request->user()->hasRole(UserRole::SUPER_ADMIN)
        ) {
            return back()->with('error', 'Only super admins can assign the Super Admin role.');
        }

        // When banning a user, record who banned them and when
        if (array_key_exists('is_banned', $data)) {
            if ($data['is_banned'] === true && ! $managedUser->is_banned) {
                $data['banned_at'] = now();
                $data['banned_by'] = $request->user()->id;
            } elseif ($data['is_banned'] === false) {
                // Clear all ban-related fields when unbanning
                $data['ban_reason'] = null;
                $data['banned_at'] = null;
                $data['banned_by'] = null;
            }
        }

        // When locking/unlocking account, reset login attempts
        if (array_key_exists('is_active', $data) && $data['is_active'] === true) {
            $data['login_attempts'] = 0;
            $data['locked_until'] = null;
        }

        $managedUser->fill($data);
        $managedUser->save();

        return back()->with('success', 'User updated successfully.');
    }
}