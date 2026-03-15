<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBankAccountRequest;
use App\Http\Requests\UpdateBankAccountRequest;
use App\Http\Resources\BankAccountResource;
use App\Models\BankAccount;
use App\Services\BankAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BankAccountController extends Controller
{
    public function __construct(
        private BankAccountService $bankAccountService
    ) {}

    public function index(): Response
    {
        $accounts = BankAccount::with(['personal', 'business'])
            ->latest()
            ->get();

        return Inertia::render('bank-accounts', [
            'accounts' => BankAccountResource::collection($accounts)->toArray(request()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Createbankaccount');
    }

    public function store(StoreBankAccountRequest $request): RedirectResponse
    {
        try {
            Log::info('BankAccountController@store called', [
                'user_id' => $request->user()?->id,
            ]);

            $bankAccount = $this->bankAccountService->create($request);

            Log::info('Bank account created successfully', [
                'bank_account_id' => $bankAccount->id,
                'account_category' => $bankAccount->account_category,
                'has_business_details' => $bankAccount->business !== null,
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to create bank account', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', __('Failed to create bank account: :message', ['message' => $e->getMessage()]));
        }

        return redirect()->route('bank-accounts.index')
            ->with('success', __('Bank account created successfully.'));
    }

    public function show(BankAccount $bankAccount): Response
    {
        $bankAccount->load(['personal', 'business']);

        return Inertia::render('bank-accounts', [
            'account' => (new BankAccountResource($bankAccount))->toArray(request()),
        ]);
    }

    public function edit(BankAccount $bankAccount): Response
    {
        $bankAccount->load(['personal', 'business']);

        return Inertia::render('Createbankaccount', [
            'account' => (new BankAccountResource($bankAccount))->toArray(request()),
            'isEdit' => true,
        ]);
    }

    public function update(UpdateBankAccountRequest $request, BankAccount $bankAccount): RedirectResponse
    {
        try {
            $this->bankAccountService->update($request, $bankAccount);
        } catch (Throwable $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', __('Failed to update bank account: :message', ['message' => $e->getMessage()]));
        }

        return redirect()->route('bank-accounts.index')
            ->with('success', __('Bank account updated successfully.'));
    }

    public function destroy(BankAccount $bankAccount): RedirectResponse
    {
        $this->bankAccountService->delete($bankAccount);

        return redirect()->route('bank-accounts.index')
            ->with('success', __('Bank account deleted successfully.'));
    }

    public function suspend(BankAccount $bankAccount): RedirectResponse
    {
        $this->bankAccountService->suspend($bankAccount);

        return redirect()->back()->with('success', __('Bank account suspended.'));
    }

    public function activate(BankAccount $bankAccount): RedirectResponse
    {
        $this->bankAccountService->activate($bankAccount);

        return redirect()->back()->with('success', __('Bank account activated.'));
    }
}
