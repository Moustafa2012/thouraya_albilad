<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Transfer Request</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:20px;">
            <h1 style="margin:0 0 8px 0;font-size:18px;line-height:1.2;">Transfer Request</h1>
            <p style="margin:0 0 16px 0;color:#6b7280;font-size:13px;line-height:1.5;">
                Please find the attached transfer request document for processing.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <tr>
                    <td style="padding:8px 0;color:#111827;font-size:13px;"><strong>Reference</strong></td>
                    <td style="padding:8px 0;color:#111827;font-size:13px;">{{ $transfer->reference_number }}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#111827;font-size:13px;"><strong>Transfer date</strong></td>
                    <td style="padding:8px 0;color:#111827;font-size:13px;">{{ optional($transfer->transfer_date)->toDateString() }}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#111827;font-size:13px;"><strong>Amount</strong></td>
                    <td style="padding:8px 0;color:#111827;font-size:13px;">
                        {{ number_format((float) $transfer->amount, 2) }} {{ strtoupper($transfer->currency) }}
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#111827;font-size:13px;"><strong>Beneficiary</strong></td>
                    <td style="padding:8px 0;color:#111827;font-size:13px;">
                        {{ $transfer->beneficiary?->name_en ?? $transfer->beneficiary?->name_ar }}
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#111827;font-size:13px;"><strong>Beneficiary IBAN</strong></td>
                    <td style="padding:8px 0;color:#111827;font-size:13px;">{{ $transfer->beneficiary?->iban }}</td>
                </tr>
            </table>

            @if(! empty($transfer->notes))
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;">
                    <p style="margin:0 0 6px 0;color:#111827;font-size:13px;"><strong>Notes</strong></p>
                    <p style="margin:0;color:#374151;font-size:13px;line-height:1.5;">{{ $transfer->notes }}</p>
                </div>
            @endif
        </div>

        <p style="margin:14px 0 0 0;color:#9ca3af;font-size:12px;line-height:1.5;text-align:center;">
            This message was generated automatically. Do not reply.
        </p>
    </div>
</body>
</html>

