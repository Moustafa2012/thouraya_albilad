<?php

namespace App\Mail;

use App\Models\Transfer;
use App\Services\TransferDocumentService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class TransferRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Transfer $transfer
    ) {}

    public function build(): self
    {
        $this->transfer->loadMissing(['bankAccount', 'beneficiary', 'user']);

        $subjectNumber = $this->transfer->transfer_number ?? "Transfer #{$this->transfer->id}";

        return $this
            ->subject("Transfer Request {$subjectNumber}")
            ->view('emails.transfer-request', [
                'transfer' => $this->transfer,
            ]);
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $pdf = app(TransferDocumentService::class)->renderPdf($this->transfer);

        $filename = ($this->transfer->transfer_number ?: "transfer-request-{$this->transfer->id}").'.pdf';

        return [
            Attachment::fromData(fn () => $pdf, $filename)
                ->withMime('application/pdf'),
        ];
    }
}
