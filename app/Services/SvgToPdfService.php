<?php

namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;

class SvgToPdfService
{
    public function convert(string $svg): string
    {
        $options = new Options;
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);

        $html = <<<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      @page { margin: 0; }
      body { margin: 0; padding: 0; }
      svg { width: 100%; height: auto; }
    </style>
  </head>
  <body>
HTML;

        $html .= $svg;
        $html .= "\n  </body>\n</html>";

        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        return $dompdf->output();
    }
}
