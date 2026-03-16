<?php

namespace App\Http\Controllers;

use App\Http\Requests\PreviewTransferRequest;
use App\Http\Requests\StoreTransferRequest;
use App\Http\Resources\BankAccountResource;
use App\Http\Resources\TransferResource;
use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\Transfer;
use App\Services\SvgToPdfService;
use App\Services\TransferDocumentService;
use App\Services\TransferService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class TransferController extends Controller
{
    public function __construct(
        private TransferService $transferService,
        private TransferDocumentService $documentService,
        private SvgToPdfService $svgToPdfService,
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

        $balanceInfo = null;
        $bankAccountId = $request->query('bankAccountId');
        $amount = $request->query('amount');
        if (is_string($bankAccountId) && is_string($amount) && is_numeric($amount)) {
            $selected = $accounts->firstWhere('id', (int) $bankAccountId);
            if ($selected) {
                $balance = (float) $selected->balance;
                $transferAmount = (float) $amount;

                $balanceInfo = [
                    'balance' => $balance,
                    'currency' => $selected->currency,
                    'sufficient' => $balance >= $transferAmount,
                ];
            }
        }

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
            'balanceInfo' => $balanceInfo,
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

        $svg = $this->documentService->renderSvg($transfer);
        $pdf = $this->svgToPdfService->convert($svg);

        $filename = ($transfer->transfer_number ?: ('transfer-'.$transfer->id)).'.pdf';

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store, private',
        ]);
    }

    public function previewSvg(PreviewTransferRequest $request): Response
    {
        $validated = $request->validated();
        $user = $request->user();

        $bankAccount = BankAccount::query()
            ->whereKey((int) $validated['bankAccountId'])
            ->where('user_id', $user->id)
            ->with(['personal', 'business'])
            ->firstOrFail();

        $beneficiary = Beneficiary::query()
            ->whereKey((int) $validated['beneficiaryId'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        $transfer = new Transfer;
        $transfer->forceFill([
            'user_id' => $user->id,
            'bank_account_id' => $bankAccount->id,
            'beneficiary_id' => $beneficiary->id,
            'amount' => (float) $validated['amount'],
            'currency' => strtoupper((string) $validated['currency']),
            'transfer_date' => Carbon::parse((string) $validated['transferDate']),
            'reference_number' => (string) $validated['referenceNumber'],
            'notes' => (string) $validated['notes'],
            'authorized_by' => (string) $validated['authorizedBy'],
            'transfer_number' => Transfer::nextTransferNumber(now()->format('Y')),
            'document_hash' => hash('sha256', json_encode($validated, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: ''),
            'bank_email' => $bankAccount->bank_email,
            'status' => 'draft',
        ]);

        $transfer->setRelation('bankAccount', $bankAccount);
        $transfer->setRelation('beneficiary', $beneficiary);
        $transfer->setRelation('user', $user);

        $svg = $this->documentService->renderSvg($transfer);

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml; charset=UTF-8',
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

    public function balanceCheck(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bankAccountId' => ['required', 'integer'],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        return to_route('transfers.create', [
            'bankAccountId' => (string) $validated['bankAccountId'],
            'amount' => (string) $validated['amount'],
        ]);
    }
}
