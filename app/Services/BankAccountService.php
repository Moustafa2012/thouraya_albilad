<?php

namespace App\Services;

use App\Http\Requests\StoreBankAccountRequest;
use App\Http\Requests\UpdateBankAccountRequest;
use App\Models\BankAccount;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class BankAccountService
{
    public function create(StoreBankAccountRequest $request): BankAccount
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();

            if ($request->boolean('is_default')) {
                BankAccount::where('is_default', true)->update(['is_default' => false]);
            }

            $bankAccountAttributes = $this->bankAccountAttributes($validated);
            $bankAccountAttributes['user_id'] = $request->user()?->id;
            $bankAccountAttributes['company_id'] = $request->user()?->company_id;

            $bankAccount = BankAccount::create($bankAccountAttributes);
            $bankAccount->syncTypeDetails($validated);

            return $bankAccount;
        });
    }

    public function update(UpdateBankAccountRequest $request, BankAccount $bankAccount): BankAccount
    {
        return DB::transaction(function () use ($request, $bankAccount) {
            $validated = $request->validated();

            if ($request->boolean('is_default')) {
                BankAccount::where('id', '!=', $bankAccount->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $bankAccount->update($this->bankAccountAttributes($validated));
            $bankAccount->updateTypeDetails($validated);

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

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function bankAccountAttributes(array $validated): array
    {
        return Arr::only($validated, [
            'account_name',
            'holder_name_ar',
            'holder_name_en',
            'holder_id_type',
            'holder_id',
            'bank_name',
            'bank_country',
            'bank_address',
            'bank_phone',
            'bank_email',
            'account_number',
            'iban',
            'swift_code',
            'currency',
            'branch_name',
            'branch_code',
            'routing_number',
            'sort_code',
            'account_type',
            'account_category',
            'balance',
            'status',
            'is_default',
            'is_active',
            'notes',
            'metadata',
        ]);
    }
}
