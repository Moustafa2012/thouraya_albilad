<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBeneficiaryRequest;
use App\Models\Beneficiary;
use App\Services\BeneficiaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeneficiaryController extends Controller
{
    public function __construct(
        private BeneficiaryService $beneficiaryService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('beneficiaries', [
            'beneficiaries' => auth()->user()->beneficiaries()
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
    public function create()
    {
        return Inertia::render('Createbeneficiary');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBeneficiaryRequest $request)
    {
        $this->beneficiaryService->create($request);

        return to_route('beneficiaries.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Beneficiary $beneficiary)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Beneficiary $beneficiary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Beneficiary $beneficiary)
    {
        //
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
