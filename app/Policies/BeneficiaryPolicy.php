<?php

namespace App\Policies;

use App\Models\Beneficiary;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BeneficiaryPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Beneficiary $beneficiary): bool
    {
        return $user->id === $beneficiary->user_id || $user->is_super_admin;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_beneficiaries');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create_beneficiaries');
    }

    public function update(User $user, Beneficiary $beneficiary): bool
    {
        return $user->id === $beneficiary->user_id && 
               $user->hasPermission('edit_beneficiaries');
    }

    public function delete(User $user, Beneficiary $beneficiary): bool
    {
        return $user->id === $beneficiary->user_id && 
               $user->hasPermission('delete_beneficiaries');
    }

    public function restore(User $user, Beneficiary $beneficiary): bool
    {
        return $user->is_super_admin;
    }

    public function forceDelete(User $user, Beneficiary $beneficiary): bool
    {
        return $user->is_super_admin;
    }
}
