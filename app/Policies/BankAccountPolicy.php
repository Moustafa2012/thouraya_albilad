<?php

namespace App\Policies;

use App\Models\BankAccount;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BankAccountPolicy
{
    use HandlesAuthorization;

    public function view(User $user, BankAccount $bankAccount): bool
    {
        return $user->id === $bankAccount->user_id || 
               $user->company_id === $bankAccount->company_id ||
               $user->is_super_admin;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create_bank_accounts');
    }

    public function update(User $user, BankAccount $bankAccount): bool
    {
        return ($user->id === $bankAccount->user_id || 
                $user->company_id === $bankAccount->company_id) &&
               $user->hasPermission('edit_bank_accounts');
    }

    public function delete(User $user, BankAccount $bankAccount): bool
    {
        return ($user->id === $bankAccount->user_id || 
                $user->company_id === $bankAccount->company_id) &&
               $user->hasPermission('delete_bank_accounts');
    }

    public function suspend(User $user, BankAccount $bankAccount): bool
    {
        return $user->hasPermission('suspend_bank_accounts');
    }

    public function activate(User $user, BankAccount $bankAccount): bool
    {
        return $user->hasPermission('activate_bank_accounts');
    }

    public function restore(User $user, BankAccount $bankAccount): bool
    {
        return $user->is_super_admin;
    }

    public function forceDelete(User $user, BankAccount $bankAccount): bool
    {
        return $user->is_super_admin;
    }
}
