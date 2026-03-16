<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBeneficiaryRequest;
use App\Http\Requests\UpdateBeneficiaryRequest;
use App\Models\Beneficiary;
use App\Services\BeneficiaryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BeneficiaryController extends Controller
{
    public function __construct(
        private BeneficiaryService $beneficiaryService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('beneficiaries', [
            'beneficiaries' => $request->user()->beneficiaries()
                ->latest()
                ->get()
                ->map(function ($beneficiary) {
                    return collect($beneficiary->toArray())->mapWithKeys(function ($value, $key) {
                        return [Str::camel($key) => $value];
                    });
                }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Createbeneficiary');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBeneficiaryRequest $request): RedirectResponse
    {
        $this->beneficiaryService->create($request);

        return to_route('beneficiaries.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Beneficiary $beneficiary): RedirectResponse
    {
        abort_unless($beneficiary->user_id === $request->user()->id, 403);

        return to_route('beneficiaries.edit', $beneficiary);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Beneficiary $beneficiary): Response
    {
        return Inertia::render('Createbeneficiary', [
            'beneficiary' => collect($beneficiary->toArray())->mapWithKeys(function ($value, $key) {
                return [Str::camel($key) => $value];
            }),
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBeneficiaryRequest $request, Beneficiary $beneficiary): RedirectResponse
    {
        $this->beneficiaryService->update($beneficiary, $request->validated());

        return to_route('beneficiaries.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Beneficiary $beneficiary)
    {
        $this->beneficiaryService->delete($beneficiary);

        return to_route('beneficiaries.index');
    }
}
