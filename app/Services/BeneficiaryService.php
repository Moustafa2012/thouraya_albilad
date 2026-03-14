<?php

namespace App\Services;

use App\Http\Requests\StoreBeneficiaryRequest;
use App\Models\Beneficiary;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BeneficiaryService
{
    public function create(StoreBeneficiaryRequest $request): Beneficiary
    {
        $data = $request->validated();

        $attributes = collect($data)->mapWithKeys(function ($value, $key) {
            return [Str::snake($key) => $value];
        })->toArray();

        return Auth::user()->beneficiaries()->create($attributes);
    }

    public function update(Beneficiary $beneficiary, array $data): Beneficiary
    {
        $attributes = collect($data)->mapWithKeys(function ($value, $key) {
            return [Str::snake($key) => $value];
        })->toArray();

        $beneficiary->update($attributes);

        return $beneficiary->refresh();
    }

    public function delete(Beneficiary $beneficiary): void
    {
        if ($beneficiary->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $beneficiary->delete();
    }

    public function forceDelete(Beneficiary $beneficiary): void
    {
        if ($beneficiary->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $beneficiary->forceDelete();
    }

    public function restore(Beneficiary $beneficiary): Beneficiary
    {
        if ($beneficiary->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $beneficiary->restore();

        return $beneficiary->refresh();
    }
}
