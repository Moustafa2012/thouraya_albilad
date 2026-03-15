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

        return $this
            ->subject("Transfer Request #{$this->transfer->id}")
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

        return [
            Attachment::fromData(fn () => $pdf, "transfer-request-{$this->transfer->id}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
