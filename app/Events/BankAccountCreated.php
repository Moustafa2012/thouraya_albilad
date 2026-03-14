<?php

namespace App\Events;

use App\Models\BankAccount;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BankAccountCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public BankAccount $bankAccount,
        public int $userId,
        public string $ipAddress,
        public ?string $userAgent = null
    ) {}
}
