<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransferRequest;
use App\Http\Resources\BankAccountResource;
use App\Http\Resources\TransferResource;
use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\Transfer;
use App\Services\TransferDocumentService;
use App\Services\TransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class TransferController extends Controller
{
    public function __construct(
        private TransferService $transferService,
        private TransferDocumentService $documentService,
    ) {}

    public function index(Request $request): InertiaResponse
    {
        $transfers = Transfer::query()
            ->where('user_id', $request->user()->id)
            ->with(['bankAccount', 'beneficiary'])
            ->latest()
            ->get();

        return Inertia::render('transfers', [
            'transfers' => TransferResource::collection($transfers)->toArray($request),
        ]);
    }

    public function create(Request $request): InertiaResponse
    {
        $accounts = BankAccount::query()
            ->where('user_id', $request->user()->id)
            ->with(['personal', 'business'])
            ->where('is_active', true)
            ->where('status', 'active')
            ->latest()
            ->get();

        $beneficiaries = Beneficiary::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(function (Beneficiary $beneficiary) {
                return collect($beneficiary->toArray())->mapWithKeys(function ($value, $key) {
                    return [Str::camel($key) => $value];
                });
            });

        return Inertia::render('Createtransfer', [
            'accounts' => BankAccountResource::collection($accounts)->toArray($request),
            'beneficiaries' => $beneficiaries,
        ]);
    }

    public function store(StoreTransferRequest $request): RedirectResponse
    {
        $transfer = $this->transferService->create($request);

        return to_route('transfers.show', $transfer)->with('success', 'Transfer created successfully.');
    }

    public function show(Request $request, Transfer $transfer): InertiaResponse
    {
        if ($transfer->user_id !== $request->user()->id) {
            abort(403);
        }

        $transfer->loadMissing(['bankAccount', 'beneficiary']);

        return Inertia::render('transfer-show', [
            'transfer' => (new TransferResource($transfer))->toArray($request),
        ]);
    }

    public function documentSvg(Request $request, Transfer $transfer): Response
    {
        if ($transfer->user_id !== $request->user()->id) {
            abort(403);
        }

        $svg = $this->documentService->renderSvg($transfer);

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml; charset=UTF-8',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store, private',
        ]);
    }

    public function documentPdf(Request $request, Transfer $transfer): Response
    {
        if ($transfer->user_id !== $request->user()->id) {
            abort(403);
        }

        $pdf = $this->documentService->renderPdf($transfer);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="transfer-request-'.$transfer->id.'.pdf"',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store, private',
        ]);
    }

    public function resend(Request $request, Transfer $transfer): RedirectResponse
    {
        if ($transfer->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->transferService->sendToBank($transfer);

        return back()->with('success', 'Transfer request sent to bank.');
    }

    public function balanceCheck(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bankAccountId' => ['required', 'integer'],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $bankAccount = BankAccount::query()
            ->whereKey((int) $validated['bankAccountId'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $bankAccount) {
            return response()->json([
                'ok' => false,
                'message' => 'Invalid bank account selection.',
            ], 404);
        }

        $balance = (float) $bankAccount->balance;
        $amount = (float) $validated['amount'];

        return response()->json([
            'ok' => true,
            'balance' => $balance,
            'currency' => $bankAccount->currency,
            'sufficient' => $balance >= $amount,
        ]);
    }
}
