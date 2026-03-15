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
                'email_verified_at',
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

        if (array_key_exists('role', $data) && $data['role'] === UserRole::SUPER_ADMIN->value && ! $request->user()->hasRole(UserRole::SUPER_ADMIN)) {
            return back()->with('error', 'Only super admins can assign the Super Admin role.');
        }

        if (array_key_exists('is_banned', $data) && $data['is_banned'] === false) {
            $data['ban_reason'] = null;
        }

        $managedUser->fill($data);
        $managedUser->save();

        return back()->with('success', 'User updated successfully.');
    }
}
