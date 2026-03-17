<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSmtpSettingsRequest;
use App\Services\SmtpSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

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
                'enabled'      => (bool) ($setting?->enabled ?? false),
                'host'         => $setting?->host,
                'port'         => $setting?->port,
                'username'     => $setting?->username,
                'encryption'   => $setting?->encryption,
                'from_address' => $setting?->from_address,
                'from_name'    => $setting?->from_name,
                'has_password' => (bool) ($setting?->password),
            ],
        ]);
    }

    public function update(UpdateSmtpSettingsRequest $request): RedirectResponse
    {
        $this->smtpSettingsService->update($request->validated());
        $this->smtpSettingsService->apply();

        return back()->with('success', 'SMTP settings updated successfully.');
    }

    public function test(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('settings:advanced'), 403);

        $setting = $this->smtpSettingsService->getOrCreate();

        if (! $setting?->enabled || ! $setting?->host) {
            return response()->json([
                'success' => false,
                'message' => 'SMTP is not configured. Please save your settings first.',
            ], 422);
        }

        try {
            $this->smtpSettingsService->apply();

            $userLocale = $request->user()->locale ?? 'en';
            App::setLocale($userLocale);
            
            $toEmail = $request->user()->email;
            $toName  = $request->user()->name;

            Mail::send([], [], function ($message) use ($toEmail, $toName, $setting, $userLocale) {
                $message->to($toEmail, $toName)
                    ->subject(__('smtp.test_email.subject'))
                    ->from(
                        $setting->from_address ?? config('mail.from.address'),
                        $setting->from_name    ?? config('mail.from.name'),
                    )
                    ->html(self::buildTestEmailHtml($toName, $userLocale));
            });

            return response()->json([
                'success' => true,
                'message' => "Test email sent successfully to {$toEmail}.",
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email: ' . $e->getMessage(),
            ], 422);
        }
    }

    private static function buildTestEmailHtml(string $recipientName, string $locale = 'en'): string
    {
        // Set locale for translations
        $currentLocale = App::getLocale();
        App::setLocale($locale);
        
        $name    = e($recipientName);
        $appName = e(config('app.name', 'Your Application'));
        $year    = date('Y');
        $time    = now()->format('D, d M Y \a\t H:i T');
        
        // Get translated content
        $subject = __('smtp.test_email.subject');
        $title = __('smtp.test_email.title');
        $greeting = __('smtp.test_email.greeting', ['name' => $name]);
        $confirmation = __('smtp.test_email.confirmation', ['app' => $appName]);
        $deliveryConfirmed = __('smtp.test_email.delivery_confirmed');
        $deliveryMessage = __('smtp.test_email.delivery_message');
        $status = __('smtp.test_email.status');
        $delivered = __('smtp.test_email.delivered');
        $sentAt = __('smtp.test_email.sent_at');
        $initiatedBy = __('smtp.test_email.initiated_by');
        $settingsPanel = __('smtp.test_email.settings_panel');
        $ignoreMessage = __('smtp.test_email.ignore_message');
        $footer = __('smtp.test_email.footer', ['year' => $year, 'app' => $appName]);
        $configurationLabel = __('smtp.test_email.configuration_label');
        
        // Determine text direction based on locale
        $dir = $locale === 'ar' ? 'rtl' : 'ltr';
        $align = $locale === 'ar' ? 'right' : 'left';
        $textAlign = $locale === 'ar' ? 'text-align: right;' : 'text-align: left;';

        return <<<HTML
        <!DOCTYPE html>
        <html lang="{$locale}" dir="{$dir}">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>{$subject}</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f0ede8;font-family:Georgia,'Times New Roman',serif;">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="background-color:#f0ede8;padding:40px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="max-width:580px;">

                  <!-- Header -->
                  <tr>
                    <td style="background-color:#1a1a18;border-radius:16px 16px 0 0;padding:36px 40px 28px;">

                      <!-- Logo mark -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                        <tr>
                          <td style="background-color:#e8e2d4;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                            <span style="font-size:16px;line-height:32px;">✉</span>
                          </td>
                          <td style="padding-left:10px;vertical-align:middle;{$textAlign}">
                            <span style="color:#e8e2d4;font-size:13px;letter-spacing:0.08em;font-family:'Courier New',Courier,monospace;opacity:0.65;">{$configurationLabel}</span>
                          </td>
                        </tr>
                      </table>

                      <!-- Headline -->
                      <h1 style="color:#e8e2d4;font-size:28px;font-weight:400;margin:0;letter-spacing:-0.02em;line-height:1.25;{$textAlign}">
                        {$title}
                      </h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background-color:#ffffff;padding:36px 40px;border-left:1px solid #e0dbd0;border-right:1px solid #e0dbd0;">

                      <p style="font-size:15px;color:#4a4842;line-height:1.75;margin:0 0 8px;{$textAlign}">
                        {$greeting}
                      </p>
                      <p style="font-size:15px;color:#4a4842;line-height:1.75;margin:0 0 28px;{$textAlign}">
                        {$confirmation}
                      </p>

                      <!-- Callout block -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                             style="background-color:#f7f4ef;border-left:3px solid #1a1a18;border-radius:0 8px 8px 0;margin-bottom:28px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="font-family:'Courier New',Courier,monospace;font-size:12px;color:#8a857c;margin:0 0 6px;letter-spacing:0.06em;text-transform:uppercase;{$textAlign}">
                              {$deliveryConfirmed}
                            </p>
                            <p style="font-size:14px;color:#2a2a26;margin:0;line-height:1.6;{$textAlign}">
                              {$deliveryMessage}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Details table -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                             style="margin-bottom:28px;">
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #e8e3da;font-size:13px;color:#8a857c;font-family:'Courier New',Courier,monospace;letter-spacing:0.04em;width:45%;{$textAlign}">
                            {$status}
                          </td>
                          <td style="padding:10px 0;border-bottom:1px solid #e8e3da;font-size:13px;color:#2a2a26;{$textAlign}">
                            <span style="background-color:#e8f4ec;color:#2d6a40;padding:3px 12px;border-radius:20px;font-size:12px;font-family:'Courier New',Courier,monospace;">
                              {$delivered}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #e8e3da;font-size:13px;color:#8a857c;font-family:'Courier New',Courier,monospace;letter-spacing:0.04em;{$textAlign}">
                            {$sentAt}
                          </td>
                          <td style="padding:10px 0;border-bottom:1px solid #e8e3da;font-size:13px;color:#2a2a26;{$textAlign}">
                            {$time}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;font-size:13px;color:#8a857c;font-family:'Courier New',Courier,monospace;letter-spacing:0.04em;{$textAlign}">
                            {$initiatedBy}
                          </td>
                          <td style="padding:10px 0;font-size:13px;color:#2a2a26;{$textAlign}">
                            {$settingsPanel}
                          </td>
                        </tr>
                      </table>

                      <p style="font-size:14px;color:#8a857c;line-height:1.7;margin:0;{$textAlign}">
                        {$ignoreMessage}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#1a1a18;border-radius:0 0 16px 16px;padding:20px 40px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-size:12px;color:#4a4845;font-family:'Courier New',Courier,monospace;letter-spacing:0.04em;{$textAlign}">
                            {$footer}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
        HTML;
        
        // Restore original locale
        App::setLocale($currentLocale);
    }
}