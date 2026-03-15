<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSmtpSettingsRequest;
use App\Services\SmtpSettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SmtpSettingsController extends Controller
{
    public function __construct(
        private SmtpSettingsService $smtpSettingsService,
    ) {}

    public function edit(Request $request): Response
    {
        abort_unless($request->user()->can('settings:advanced'), 403);

        $setting = $this->smtpSettingsService->getOrCreate();

        return Inertia::render('settings/smtp', [
            'smtp' => [
                'enabled' => (bool) ($setting?->enabled ?? false),
                'host' => $setting?->host,
                'port' => $setting?->port,
                'username' => $setting?->username,
                'encryption' => $setting?->encryption,
                'from_address' => $setting?->from_address,
                'from_name' => $setting?->from_name,
                'has_password' => (bool) ($setting?->password),
            ],
        ]);
    }

    public function update(UpdateSmtpSettingsRequest $request): RedirectResponse
    {
        $this->smtpSettingsService->update($request->validated());
        $this->smtpSettingsService->apply();

        return back()->with('success', 'SMTP settings updated.');
    }
}
