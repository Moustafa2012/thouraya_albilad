<?php

namespace App\Services;

use App\Models\Transfer;
use Illuminate\Support\Str;

class TransferDocumentService
{
    public function renderSvg(Transfer $transfer): string
    {
        $transfer->loadMissing(['bankAccount', 'beneficiary', 'user']);

        $bank = $transfer->bankAccount;
        $beneficiary = $transfer->beneficiary;

        $amount = number_format((float) $transfer->amount, 2);
        $currency = strtoupper((string) $transfer->currency);
        $title = 'Transfer Request';
        $titleAr = 'طلب تحويل';
        $date = $transfer->transfer_date?->toDateString() ?? '';
        $ref = (string) $transfer->reference_number;
        $docId = 'TR-'.str_pad((string) $transfer->id, 6, '0', STR_PAD_LEFT);

        $notes = $transfer->notes ? Str::limit($transfer->notes, 220) : '';
        $notesEscaped = htmlspecialchars($notes, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $generatedAt = now()->toIso8601String();

        $bankName = htmlspecialchars((string) $bank->bank_name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $bankIban = htmlspecialchars((string) $bank->iban, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $bankEmail = htmlspecialchars((string) ($bank->bank_email ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        $benName = htmlspecialchars((string) ($beneficiary->name_ar ?: $beneficiary->name_en), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $benIban = htmlspecialchars((string) $beneficiary->iban, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $benBank = htmlspecialchars((string) $beneficiary->bank_name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="790" viewBox="0 0 1120 790" role="img" aria-label="{$title}">
  <defs>
    <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0b1220" flood-opacity="0.18"/>
    </filter>
    <style>
      .h1{font:700 26px system-ui, -apple-system, Segoe UI, Roboto, Arial}
      .h1ar{font:700 24px "Tajawal", system-ui, -apple-system, Segoe UI, Roboto, Arial}
      .k{font:600 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; letter-spacing:.14em; text-transform:uppercase; fill:#64748b}
      .v{font:600 15px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0f172a}
      .mono{font:600 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; fill:#0f172a}
      .muted{fill:#475569}
      .pill{font:700 11px system-ui, -apple-system, Segoe UI, Roboto, Arial}
    </style>
  </defs>

  <rect x="0" y="0" width="1120" height="790" fill="#eef2ff"/>
  <g filter="url(#shadow)">
    <rect x="70" y="56" width="980" height="678" rx="22" fill="url(#paper)" stroke="#e2e8f0"/>
    <rect x="70" y="56" width="980" height="126" rx="22" fill="url(#hdr)"/>
    <rect x="70" y="160" width="980" height="1" fill="#ffffff" opacity="0.22"/>

    <text x="110" y="110" class="h1" fill="#ffffff">{$title}</text>
    <text x="1010" y="110" class="h1ar" fill="#ffffff" text-anchor="end">{$titleAr}</text>

    <g>
      <rect x="110" y="122" width="144" height="30" rx="999" fill="#ffffff" opacity="0.14"/>
      <text x="182" y="142" class="pill" fill="#ffffff" text-anchor="middle">{$docId}</text>
    </g>

    <g>
      <text x="110" y="214" class="k">Transfer date</text>
      <text x="110" y="240" class="v">{$date}</text>

      <text x="372" y="214" class="k">Reference</text>
      <text x="372" y="240" class="mono">{$ref}</text>

      <text x="690" y="214" class="k">Amount</text>
      <text x="690" y="240" class="v">{$amount} {$currency}</text>
    </g>

    <g>
      <rect x="110" y="278" width="900" height="162" rx="18" fill="#ffffff" stroke="#e2e8f0"/>
      <text x="134" y="318" class="k">From (Bank account)</text>
      <text x="986" y="318" class="k" text-anchor="end">من (الحساب البنكي)</text>

      <text x="134" y="350" class="v">{$bankName}</text>
      <text x="134" y="374" class="mono">{$bankIban}</text>
      <text x="134" y="398" class="v muted">{$bankEmail}</text>

      <line x1="560" y1="308" x2="560" y2="418" stroke="#e2e8f0"/>

      <text x="586" y="318" class="k">To (Beneficiary)</text>
      <text x="986" y="318" class="k" text-anchor="end">إلى (المستفيد)</text>

      <text x="586" y="350" class="v">{$benName}</text>
      <text x="586" y="374" class="mono">{$benIban}</text>
      <text x="586" y="398" class="v muted">{$benBank}</text>
    </g>

    <g>
      <rect x="110" y="468" width="900" height="176" rx="18" fill="#ffffff" stroke="#e2e8f0"/>
      <text x="134" y="510" class="k">Notes</text>
      <text x="986" y="510" class="k" text-anchor="end">ملاحظات</text>
      <text x="134" y="542" class="v muted">{$notesEscaped}</text>
    </g>

    <g opacity="0.16">
      <text x="560" y="600" class="h1" fill="#0f172a" text-anchor="middle" transform="rotate(-12 560 600)">CONFIDENTIAL</text>
    </g>

    <g>
      <text x="110" y="706" class="k">Generated</text>
      <text x="110" y="728" class="v muted">{$generatedAt}</text>
      <text x="1010" y="706" class="k" text-anchor="end">Document hash</text>
      <text x="1010" y="728" class="mono" text-anchor="end">{$transfer->document_hash}</text>
    </g>
  </g>
</svg>
SVG;
    }

    public function renderPdf(Transfer $transfer): string
    {
        $transfer->loadMissing(['bankAccount', 'beneficiary', 'user']);

        $docId = 'TR-'.str_pad((string) $transfer->id, 6, '0', STR_PAD_LEFT);
        $amount = number_format((float) $transfer->amount, 2).' '.strtoupper((string) $transfer->currency);

        $lines = [
            ['x' => 72, 'y' => 770, 'size' => 18, 'text' => 'Transfer Request'],
            ['x' => 72, 'y' => 748, 'size' => 11, 'text' => $docId],
            ['x' => 72, 'y' => 710, 'size' => 10, 'text' => 'Transfer date: '.($transfer->transfer_date?->toDateString() ?? '')],
            ['x' => 72, 'y' => 694, 'size' => 10, 'text' => 'Reference: '.$transfer->reference_number],
            ['x' => 72, 'y' => 678, 'size' => 10, 'text' => 'Amount: '.$amount],
            ['x' => 72, 'y' => 646, 'size' => 12, 'text' => 'From (Bank account)'],
            ['x' => 72, 'y' => 628, 'size' => 10, 'text' => 'Bank: '.$transfer->bankAccount->bank_name],
            ['x' => 72, 'y' => 612, 'size' => 10, 'text' => 'IBAN: '.$transfer->bankAccount->iban],
            ['x' => 72, 'y' => 596, 'size' => 10, 'text' => 'Bank email: '.($transfer->bankAccount->bank_email ?? '')],
            ['x' => 72, 'y' => 564, 'size' => 12, 'text' => 'To (Beneficiary)'],
            ['x' => 72, 'y' => 546, 'size' => 10, 'text' => 'Name: '.($transfer->beneficiary->name_en ?: $transfer->beneficiary->name_ar)],
            ['x' => 72, 'y' => 530, 'size' => 10, 'text' => 'Bank: '.$transfer->beneficiary->bank_name],
            ['x' => 72, 'y' => 514, 'size' => 10, 'text' => 'IBAN: '.$transfer->beneficiary->iban],
            ['x' => 72, 'y' => 482, 'size' => 12, 'text' => 'Notes'],
            ['x' => 72, 'y' => 464, 'size' => 10, 'text' => $transfer->notes ?: '—'],
            ['x' => 72, 'y' => 86, 'size' => 8, 'text' => 'Document hash: '.($transfer->document_hash ?? '')],
        ];

        return $this->buildMinimalPdf($lines);
    }

    /**
     * @param  array<int, array{x:int,y:int,size:int,text:string}>  $lines
     */
    private function buildMinimalPdf(array $lines): string
    {
        $content = "BT\n";
        foreach ($lines as $line) {
            $text = $this->escapePdfText($line['text']);
            $content .= sprintf("/F1 %d Tf\n1 0 0 1 %d %d Tm\n(%s) Tj\n", $line['size'], $line['x'], $line['y'], $text);
        }
        $content .= "ET\n";

        $objects = [];
        $offsets = [];

        $objects[] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
        $objects[] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
        $objects[] = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n";
        $objects[] = "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
        $objects[] = "5 0 obj\n<< /Length ".strlen($content)." >>\nstream\n".$content."endstream\nendobj\n";

        $pdf = "%PDF-1.4\n";
        foreach ($objects as $obj) {
            $offsets[] = strlen($pdf);
            $pdf .= $obj;
        }

        $xrefStart = strlen($pdf);
        $pdf .= "xref\n0 ".(count($objects) + 1)."\n";
        $pdf .= "0000000000 65535 f \n";
        foreach ($offsets as $offset) {
            $pdf .= sprintf("%010d 00000 n \n", $offset);
        }

        $pdf .= "trailer\n<< /Size ".(count($objects) + 1)." /Root 1 0 R >>\nstartxref\n{$xrefStart}\n%%EOF";

        return $pdf;
    }

    private function escapePdfText(string $text): string
    {
        $text = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        return preg_replace('/[\\x00-\\x1F\\x7F]/u', '', $text) ?? '';
    }
}
