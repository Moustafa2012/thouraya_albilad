<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransferResource;
use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\Transfer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    public function __invoke(Request $request): InertiaResponse
    {
        $user = $request->user();
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $transfersThisMonth = Transfer::query()
            ->where('user_id', $user->id)
            ->whereBetween('transfer_date', [$startOfMonth, $endOfMonth]);

        $totalTransfersCount = (clone $transfersThisMonth)->count();
        $totalAmountThisMonth = (float) (clone $transfersThisMonth)->sum('amount');

        $activeBeneficiariesCount = Beneficiary::query()
            ->where('user_id', $user->id)
            ->count();

        $bankAccountsCount = BankAccount::query()
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->where('status', 'active')
            ->count();

        $latestTransfers = Transfer::query()
            ->where('user_id', $user->id)
            ->with(['bankAccount', 'beneficiary'])
            ->latest()
            ->limit(5)
            ->get();

        $transfersByCurrency = Transfer::query()
            ->where('user_id', $user->id)
            ->whereBetween('transfer_date', [$startOfMonth, $endOfMonth])
            ->selectRaw('currency, count(*) as count, sum(amount) as total')
            ->groupBy('currency')
            ->get()
            ->map(fn ($row) => [
                'currency' => $row->currency,
                'count' => (int) $row->count,
                'total' => (float) $row->total,
            ]);

        $volumeOverTime = Transfer::query()
            ->where('user_id', $user->id)
            ->whereBetween('transfer_date', [now()->subDays(14)->startOfDay(), now()])
            ->selectRaw('date(transfer_date) as date, count(*) as count, sum(amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'count' => (int) $row->count,
                'total' => (float) $row->total,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'transfersThisMonth' => $totalTransfersCount,
                'totalAmountThisMonth' => $totalAmountThisMonth,
                'activeBeneficiaries' => $activeBeneficiariesCount,
                'bankAccounts' => $bankAccountsCount,
            ],
            'latestTransfers' => TransferResource::collection($latestTransfers)->toArray($request),
            'transfersByCurrency' => $transfersByCurrency,
            'volumeOverTime' => $volumeOverTime,
        ]);
    }
}
