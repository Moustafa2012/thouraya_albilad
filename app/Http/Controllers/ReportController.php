<?php

namespace App\Http\Controllers;

use App\Http\Resources\BankAccountResource;
use App\Models\BankAccount;
use App\Models\JournalEntry;
use App\Models\Transfer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ReportController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('reports', [
            'bankAccounts' => $this->bankAccounts($request),
        ]);
    }

    public function bankStatement(Request $request): InertiaResponse
    {
        $validated = $request->validate([
            'bank_account_id' => ['required', 'integer', 'exists:bank_accounts,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $account = BankAccount::query()
            ->where('id', $validated['bank_account_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $start = $validated['start_date'];
        $end = $validated['end_date'];

        $transfers = Transfer::query()
            ->where('bank_account_id', $account->id)
            ->with('beneficiary')
            ->whereBetween('transfer_date', [$start, $end])
            ->orderBy('transfer_date')
            ->orderBy('id')
            ->get()
            ->map(fn ($t) => [
                'date' => $t->transfer_date->toDateString(),
                'description' => 'Transfer '.$t->transfer_number.' to '.($t->beneficiary->name_en ?? $t->beneficiary->name_ar),
                'debit' => 0,
                'credit' => (float) $t->amount,
                'type' => 'transfer',
            ]);

        $entries = JournalEntry::query()
            ->where('bank_account_id', $account->id)
            ->whereBetween('date', [$start, $end])
            ->orderBy('date')
            ->orderBy('id')
            ->get()
            ->map(fn ($e) => [
                'date' => $e->date->toDateString(),
                'description' => $e->description,
                'debit' => $e->direction === 'debit' ? (float) $e->amount : 0,
                'credit' => $e->direction === 'credit' ? (float) $e->amount : 0,
                'type' => 'journal',
            ]);

        $lines = collect($transfers)->concat($entries)->sortBy('date')->values();
        $openingBalance = $this->openingBalanceBefore($account->id, $start);
        $running = $openingBalance;
        $rows = [];
        $rows[] = ['date' => null, 'description' => 'Opening balance', 'debit' => null, 'credit' => null, 'balance' => $running];
        foreach ($lines as $line) {
            $running += ($line['debit'] ?? 0) - ($line['credit'] ?? 0);
            $rows[] = [
                'date' => $line['date'],
                'description' => $line['description'],
                'debit' => $line['debit'] ?: null,
                'credit' => $line['credit'] ?: null,
                'balance' => round($running, 2),
            ];
        }

        return Inertia::render('reports', [
            'bankAccounts' => $this->bankAccounts($request),
            'statementData' => [
                'rows' => $rows,
                'openingBalance' => $openingBalance,
                'closingBalance' => round($running, 2),
                'account' => (new BankAccountResource($account))->toArray($request),
            ],
        ]);
    }

    public function beneficiaryStatement(Request $request): InertiaResponse
    {
        $totals = Transfer::query()
            ->where('user_id', $request->user()->id)
            ->join('beneficiaries', 'transfers.beneficiary_id', '=', 'beneficiaries.id')
            ->selectRaw('beneficiaries.id as beneficiary_id, beneficiaries.name_en, beneficiaries.name_ar, beneficiaries.bank_name, sum(transfers.amount) as total_amount, count(transfers.id) as transfer_count')
            ->groupBy('beneficiaries.id', 'beneficiaries.name_en', 'beneficiaries.name_ar', 'beneficiaries.bank_name')
            ->get()
            ->map(fn ($r) => [
                'beneficiaryId' => $r->beneficiary_id,
                'nameEn' => $r->name_en,
                'nameAr' => $r->name_ar,
                'bankName' => $r->bank_name,
                'totalAmount' => (float) $r->total_amount,
                'transferCount' => (int) $r->transfer_count,
            ]);

        return Inertia::render('reports', [
            'bankAccounts' => $this->bankAccounts($request),
            'beneficiaryData' => $totals,
        ]);
    }

    public function summary(Request $request): InertiaResponse
    {
        $user = $request->user();
        $byCurrency = Transfer::query()
            ->where('user_id', $user->id)
            ->selectRaw('currency, sum(amount) as total, count(*) as count')
            ->groupBy('currency')
            ->get()
            ->map(fn ($r) => ['currency' => $r->currency, 'total' => (float) $r->total, 'count' => (int) $r->count]);

        $byBeneficiary = Transfer::query()
            ->where('user_id', $user->id)
            ->join('beneficiaries', 'transfers.beneficiary_id', '=', 'beneficiaries.id')
            ->selectRaw('beneficiaries.name_en, beneficiaries.name_ar, sum(transfers.amount) as total')
            ->groupBy('beneficiaries.id', 'beneficiaries.name_en', 'beneficiaries.name_ar')
            ->get()
            ->map(fn ($r) => ['name' => $r->name_en ?: $r->name_ar, 'total' => (float) $r->total]);

        $byBank = Transfer::query()
            ->where('user_id', $user->id)
            ->join('bank_accounts', 'transfers.bank_account_id', '=', 'bank_accounts.id')
            ->selectRaw('bank_accounts.bank_name, sum(transfers.amount) as total')
            ->groupBy('bank_accounts.bank_name')
            ->get()
            ->map(fn ($r) => ['bankName' => $r->bank_name, 'total' => (float) $r->total]);

        return Inertia::render('reports', [
            'bankAccounts' => $this->bankAccounts($request),
            'summaryData' => [
                'byCurrency' => $byCurrency,
                'byBeneficiary' => $byBeneficiary,
                'byBank' => $byBank,
            ],
        ]);
    }

    private function bankAccounts(Request $request): array
    {
        $accounts = BankAccount::query()
            ->where('user_id', $request->user()->id)
            ->where('is_active', true)
            ->with(['personal', 'business'])
            ->orderBy('bank_name')
            ->get();

        return BankAccountResource::collection($accounts)->toArray($request);
    }

    private function openingBalanceBefore(int $bankAccountId, string $beforeDate): float
    {
        $account = BankAccount::find($bankAccountId);
        if (! $account) {
            return 0;
        }
        $currentBalance = (float) $account->balance;

        $transfersAfter = (float) Transfer::query()
            ->where('bank_account_id', $bankAccountId)
            ->where('transfer_date', '>=', $beforeDate)
            ->sum('amount');
        $journalDebitsAfter = (float) JournalEntry::query()
            ->where('bank_account_id', $bankAccountId)
            ->where('date', '>=', $beforeDate)
            ->where('direction', 'debit')
            ->sum('amount');
        $journalCreditsAfter = (float) JournalEntry::query()
            ->where('bank_account_id', $bankAccountId)
            ->where('date', '>=', $beforeDate)
            ->where('direction', 'credit')
            ->sum('amount');

        return $currentBalance + $transfersAfter + $journalCreditsAfter - $journalDebitsAfter;
    }
}
