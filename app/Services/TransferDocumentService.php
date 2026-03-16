<?php

namespace App\Services;

use App\Models\Transfer;

class TransferDocumentService
{
    public function renderSvg(Transfer $transfer): string
    {
        $transfer->loadMissing(['bankAccount.business', 'beneficiary', 'user']);

        $bank = $transfer->bankAccount;
        $beneficiary = $transfer->beneficiary;

        $amount = number_format((float) $transfer->amount, 2);
        $currency = strtoupper((string) $transfer->currency);
        $title = 'Bank Transfer Request';
        $titleAr = 'طلب تحويل بنكي';
        $date = $transfer->transfer_date?->format('F j, Y') ?? '';
        $ref = (string) $transfer->reference_number;
        $transferNumber = $transfer->transfer_number ?? 'TR-'.str_pad((string) $transfer->id, 6, '0', STR_PAD_LEFT);

        $amountWords = $this->amountToWords((float) $transfer->amount, $currency);
        $purpose = (string) ($transfer->notes ?? '');
        $purposeBlock = trim("Amount in words: {$amountWords}\n".$purpose);
        $purposeTspans = $this->svgWrappedTspans($purposeBlock, 134, 560, 76, 6, 18);
        $generatedAt = now()->toIso8601String();

        $companyName = $this->escape((string) config('app.name'));
        $companyCr = $this->escape((string) (config('company.cr_number') ?? env('COMPANY_CR_NUMBER', '0000000000')));

        $bankName = htmlspecialchars((string) $bank->bank_name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $bankAccountNo = htmlspecialchars((string) ($bank->account_number ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $bankIban = htmlspecialchars((string) $bank->iban, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $bankEmail = htmlspecialchars((string) ($bank->bank_email ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        $benName = htmlspecialchars((string) ($beneficiary->name_ar ?: $beneficiary->name_en), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $benIban = htmlspecialchars((string) $beneficiary->iban, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $benBank = htmlspecialchars((string) $beneficiary->bank_name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $benCountry = htmlspecialchars($this->countryDisplayName((string) ($beneficiary->country ?? '')), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        $authorizedBy = $this->escape((string) ($transfer->authorized_by ?: ($bank->business?->authorized_signatory_name ?? $transfer->user?->name ?? '')));

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="850" viewBox="0 0 1120 850" role="img" aria-label="{$title}">
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

  <rect x="0" y="0" width="1120" height="850" fill="#eef2ff"/>
  <g filter="url(#shadow)">
    <rect x="70" y="56" width="980" height="738" rx="22" fill="url(#paper)" stroke="#e2e8f0"/>
    <rect x="70" y="56" width="980" height="126" rx="22" fill="url(#hdr)"/>
    <rect x="70" y="160" width="980" height="1" fill="#ffffff" opacity="0.22"/>

    <text x="110" y="110" class="h1" fill="#ffffff">{$title}</text>
    <text x="1010" y="110" class="h1ar" fill="#ffffff" text-anchor="end">{$titleAr}</text>

    <text x="110" y="136" class="pill" fill="#ffffff">{$companyName} · CR: {$companyCr}</text>
    <text x="1010" y="136" class="pill" fill="#ffffff" text-anchor="end">{$companyName} · CR: {$companyCr}</text>

    <g>
      <rect x="110" y="122" width="180" height="30" rx="999" fill="#ffffff" opacity="0.14"/>
      <text x="200" y="142" class="pill" fill="#ffffff" text-anchor="middle">{$transferNumber}</text>
    </g>

    <g>
      <text x="110" y="214" class="k">Transfer date</text>
      <text x="110" y="240" class="v">{$date}</text>

      <text x="372" y="214" class="k">Reference</text>
      <text x="372" y="240" class="mono">{$ref}</text>

      <text x="630" y="214" class="k">Amount</text>
      <text x="630" y="240" class="v">{$amount}</text>
      <text x="800" y="214" class="k">Currency</text>
      <text x="800" y="240" class="v">{$currency}</text>
    </g>

    <g>
      <rect x="110" y="278" width="900" height="182" rx="18" fill="#ffffff" stroke="#e2e8f0"/>
      <text x="134" y="318" class="k">Sender (Bank account)</text>
      <text x="986" y="318" class="k" text-anchor="end">المرسل (الحساب البنكي)</text>

      <text x="134" y="350" class="v">{$bankName}</text>
      <text x="134" y="374" class="mono">{$bankAccountNo}</text>
      <text x="134" y="398" class="mono">{$bankIban}</text>
      <text x="134" y="422" class="v muted">{$bankEmail}</text>

      <line x1="560" y1="308" x2="560" y2="448" stroke="#e2e8f0"/>

      <text x="586" y="318" class="k">Beneficiary</text>
      <text x="986" y="318" class="k" text-anchor="end">المستفيد</text>

      <text x="586" y="350" class="v">{$benName}</text>
      <text x="586" y="374" class="mono">{$benIban}</text>
      <text x="586" y="398" class="v">{$benBank}</text>
      <text x="586" y="422" class="v muted">{$benCountry}</text>
    </g>

    <g>
      <rect x="110" y="488" width="900" height="156" rx="18" fill="#ffffff" stroke="#e2e8f0"/>
      <text x="134" y="528" class="k">Transfer purpose</text>
      <text x="986" y="528" class="k" text-anchor="end">غرض التحويل</text>
      <text class="v muted">
        {$purposeTspans}
      </text>
    </g>

    <g>
      <rect x="110" y="668" width="900" height="96" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="134" y="698" class="k">Authentication</text>
      <text x="986" y="698" class="k" text-anchor="end">المصادقة</text>
      <rect x="134" y="708" width="100" height="44" rx="6" fill="#fff" stroke="#cbd5e1"/>
      <text x="184" y="732" class="k muted" text-anchor="middle" font-size="9">Stamp</text>
      <text x="986" y="732" class="k muted" text-anchor="end" font-size="9">الختم</text>
      <rect x="254" y="708" width="120" height="44" rx="6" fill="#fff" stroke="#cbd5e1"/>
      <text x="314" y="732" class="k muted" text-anchor="middle" font-size="9">Signature</text>
      <text x="986" y="732" class="k muted" text-anchor="end" font-size="9">التوقيع</text>
      <text x="400" y="718" class="k">Authorized by</text>
      <text x="400" y="738" class="v">{$authorizedBy}</text>
      <text x="986" y="738" class="k" text-anchor="end" font-size="9">المفوض بالتوقيع</text>
    </g>

    <g>
      <text x="110" y="788" class="k">Generated</text>
      <text x="110" y="808" class="v muted">{$generatedAt}</text>
      <text x="1010" y="788" class="k" text-anchor="end">Document hash</text>
      <text x="1010" y="808" class="mono" text-anchor="end">{$transfer->document_hash}</text>
    </g>
  </g>
</svg>
SVG;
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    private function countryDisplayName(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        if (strlen($value) !== 2) {
            return $value;
        }

        $map = [
            'SA' => 'Saudi Arabia',
            'TR' => 'Turkey',
            'AE' => 'United Arab Emirates',
            'QA' => 'Qatar',
            'BH' => 'Bahrain',
            'KW' => 'Kuwait',
            'OM' => 'Oman',
            'JO' => 'Jordan',
            'EG' => 'Egypt',
            'GB' => 'United Kingdom',
            'US' => 'United States',
            'IN' => 'India',
            'CA' => 'Canada',
            'AU' => 'Australia',
        ];

        $code = strtoupper($value);

        return $map[$code] ?? $code;
    }

    private function amountToWords(float $amount, string $currency): string
    {
        $integer = (int) floor($amount + 0.00001);
        $words = $this->numberToWordsInteger($integer);

        $currencyName = match (strtoupper($currency)) {
            'USD' => 'US Dollars',
            'SAR' => 'Saudi Riyals',
            'EUR' => 'Euros',
            'GBP' => 'British Pounds',
            default => strtoupper($currency),
        };

        return trim($words.' '.$currencyName.' Only');
    }

    private function numberToWordsInteger(int $num): string
    {
        $ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        $tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        $teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        $convertLessThanOneThousand = function (int $n) use (&$convertLessThanOneThousand, $ones, $tens, $teens): string {
            if ($n === 0) {
                return '';
            }
            if ($n < 10) {
                return $ones[$n];
            }
            if ($n < 20) {
                return $teens[$n - 10];
            }
            if ($n < 100) {
                return $tens[(int) floor($n / 10)].($n % 10 !== 0 ? ' '.$ones[$n % 10] : '');
            }

            return $ones[(int) floor($n / 100)].' Hundred'.($n % 100 !== 0 ? ' and '.$convertLessThanOneThousand($n % 100) : '');
        };

        $convert = function (int $n) use (&$convert, $convertLessThanOneThousand): string {
            if ($n === 0) {
                return 'Zero';
            }
            if ($n < 1000) {
                return $convertLessThanOneThousand($n);
            }
            if ($n < 1000000) {
                return trim($convertLessThanOneThousand((int) floor($n / 1000)).' Thousand'.($n % 1000 !== 0 ? ' '.$convertLessThanOneThousand($n % 1000) : ''));
            }
            if ($n < 1000000000) {
                return trim($convertLessThanOneThousand((int) floor($n / 1000000)).' Million'.($n % 1000000 !== 0 ? ' '.$convert($n % 1000000) : ''));
            }

            return trim($convertLessThanOneThousand((int) floor($n / 1000000000)).' Billion'.($n % 1000000000 !== 0 ? ' '.$convert($n % 1000000000) : ''));
        };

        return $convert(max(0, $num));
    }

    private function svgWrappedTspans(string $text, int $x, int $y, int $maxChars, int $maxLines, int $lineHeight): string
    {
        $paragraphs = preg_split("/\R/u", $text) ?: [];
        $lines = [];

        foreach ($paragraphs as $p) {
            $p = trim(preg_replace('/\s+/u', ' ', (string) $p) ?? '');
            if ($p === '') {
                continue;
            }

            $words = preg_split('/\s+/u', $p) ?: [];
            $current = '';

            foreach ($words as $word) {
                $candidate = $current === '' ? $word : ($current.' '.$word);

                if (mb_strlen($candidate) <= $maxChars) {
                    $current = $candidate;

                    continue;
                }

                if ($current !== '') {
                    $lines[] = $current;
                    $current = $word;
                } else {
                    $lines[] = mb_substr($candidate, 0, $maxChars);
                    $current = '';
                }

                if (count($lines) >= $maxLines) {
                    break 2;
                }
            }

            if ($current !== '' && count($lines) < $maxLines) {
                $lines[] = $current;
            }

            if (count($lines) >= $maxLines) {
                break;
            }
        }

        if (count($lines) === 0) {
            $lines = ['—'];
        }

        if (count($lines) > $maxLines) {
            $lines = array_slice($lines, 0, $maxLines);
        }

        $out = [];
        foreach ($lines as $i => $line) {
            $escaped = $this->escape($line);
            if ($i === 0) {
                $out[] = "<tspan x=\"{$x}\" y=\"{$y}\">{$escaped}</tspan>";
            } else {
                $out[] = "<tspan x=\"{$x}\" dy=\"{$lineHeight}\">{$escaped}</tspan>";
            }
        }

        return implode("\n", $out);
    }

    public function renderPdf(Transfer $transfer): string
    {
        $transfer->loadMissing(['bankAccount.business', 'beneficiary', 'user']);

        $bank = $transfer->bankAccount;
        $beneficiary = $transfer->beneficiary;
        $transferNumber = $transfer->transfer_number ?? 'TR-'.str_pad((string) $transfer->id, 6, '0', STR_PAD_LEFT);
        $amount = number_format((float) $transfer->amount, 2);
        $currency = strtoupper((string) $transfer->currency);
        $authorizedBy = $bank->business?->authorized_signatory_name ?? '';

        $lines = [
            ['x' => 72, 'y' => 770, 'size' => 18, 'text' => 'Bank Transfer Request'],
            ['x' => 72, 'y' => 748, 'size' => 11, 'text' => $transferNumber],
            ['x' => 72, 'y' => 730, 'size' => 10, 'text' => 'Transfer date: '.($transfer->transfer_date?->toDateString() ?? '')],
            ['x' => 72, 'y' => 714, 'size' => 10, 'text' => 'Reference: '.$transfer->reference_number],
            ['x' => 72, 'y' => 698, 'size' => 10, 'text' => 'Amount: '.$amount],
            ['x' => 72, 'y' => 682, 'size' => 10, 'text' => 'Currency: '.$currency],
            ['x' => 72, 'y' => 658, 'size' => 12, 'text' => 'Sender (Bank account)'],
            ['x' => 72, 'y' => 640, 'size' => 10, 'text' => 'Bank: '.$bank->bank_name],
            ['x' => 72, 'y' => 624, 'size' => 10, 'text' => 'Account number: '.($bank->account_number ?? '')],
            ['x' => 72, 'y' => 608, 'size' => 10, 'text' => 'IBAN: '.$bank->iban],
            ['x' => 72, 'y' => 592, 'size' => 10, 'text' => 'Bank email: '.($bank->bank_email ?? '')],
            ['x' => 72, 'y' => 568, 'size' => 12, 'text' => 'Beneficiary'],
            ['x' => 72, 'y' => 550, 'size' => 10, 'text' => 'Name: '.($beneficiary->name_en ?: $beneficiary->name_ar)],
            ['x' => 72, 'y' => 534, 'size' => 10, 'text' => 'Bank: '.$beneficiary->bank_name],
            ['x' => 72, 'y' => 518, 'size' => 10, 'text' => 'IBAN: '.$beneficiary->iban],
            ['x' => 72, 'y' => 502, 'size' => 10, 'text' => 'Country: '.($beneficiary->country ?? '')],
            ['x' => 72, 'y' => 478, 'size' => 12, 'text' => 'Notes'],
            ['x' => 72, 'y' => 460, 'size' => 10, 'text' => $transfer->notes ?: '—'],
            ['x' => 72, 'y' => 432, 'size' => 10, 'text' => 'Authorized by: '.$authorizedBy],
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
