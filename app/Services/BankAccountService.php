<?php

namespace App\Services;

use App\Http\Requests\StoreBankAccountRequest;
use App\Http\Requests\UpdateBankAccountRequest;
use App\Models\BankAccount;
use App\Models\PersonalBankAccount;
use App\Models\BusinessBankAccount;
use Illuminate\Support\Facades\DB;

class BankAccountService
{
    public function create(StoreBankAccountRequest $request): BankAccount
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            if ($request->boolean('is_default')) {
                BankAccount::where('is_default', true)->update(['is_default' => false]);
            }

            $data['user_id'] = $request->user()?->id;
            $data['company_id'] = $request->user()?->company_id;

            $bankAccount = BankAccount::create($data);
            $bankAccount->syncTypeDetails($data);

            return $bankAccount;
        });
    }

    public function update(UpdateBankAccountRequest $request, BankAccount $bankAccount): BankAccount
    {
        return DB::transaction(function () use ($request, $bankAccount) {
            $data = $request->validated();

            if ($request->boolean('is_default')) {
                BankAccount::where('id', '!=', $bankAccount->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $bankAccount->update($data);
            $bankAccount->updateTypeDetails($data);

            return $bankAccount->refresh();
        });
    }

    public function suspend(BankAccount $bankAccount): void
    {
        $bankAccount->update(['status' => 'suspended', 'is_active' => false]);
    }

    public function activate(BankAccount $bankAccount): void
    {
        $bankAccount->update(['status' => 'active', 'is_active' => true]);
    }

    public function delete(BankAccount $bankAccount): void
    {
        $bankAccount->delete();
    }

    public function forceDelete(BankAccount $bankAccount): void
    {
        $bankAccount->forceDelete();
    }

    public function restore(BankAccount $bankAccount): void
    {
        $bankAccount->restore();
    }
}
