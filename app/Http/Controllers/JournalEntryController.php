<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJournalEntryRequest;
use App\Http\Resources\JournalEntryResource;
use App\Models\JournalEntry;
use App\Services\JournalEntryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class JournalEntryController extends Controller
{
    public function __construct(
        private JournalEntryService $journalEntryService,
    ) {}

    public function index(Request $request): InertiaResponse
    {
        $entries = JournalEntry::query()
            ->where('user_id', $request->user()->id)
            ->latest('date')
            ->latest()
            ->get();

        return Inertia::render('journals', [
            'journals' => JournalEntryResource::collection($entries)->toArray($request),
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Createjournal');
    }

    public function store(StoreJournalEntryRequest $request): RedirectResponse
    {
        $this->journalEntryService->create($request);

        return to_route('journals')->with('success', 'Journal entry created successfully.');
    }
}
