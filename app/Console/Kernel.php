<?php

namespace App\Console;

use App\Jobs\PruneOldLogs;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Archive old activity logs (keep 1 year)
        $schedule->job(new PruneOldLogs('activity', 365))
            ->daily()
            ->at('02:00')
            ->description('Prune activity logs older than 1 year');

        // Archive old login history (keep 6 months)
        $schedule->job(new PruneOldLogs('login_history', 180))
            ->daily()
            ->at('03:00')
            ->description('Prune login history older than 6 months');

        // Archive old audit logs (keep 2 years)
        $schedule->job(new PruneOldLogs('audit', 730))
            ->daily()
            ->at('04:00')
            ->description('Prune audit logs older than 2 years');

        // Clean up soft-deleted records older than 90 days
        $schedule->command('model:prune', [
            '--model' => 'App\\Models\\BankAccount',
            '--older' => '90 days',
        ])->weekly()->description('Prune soft-deleted bank accounts');

        $schedule->command('model:prune', [
            '--model' => 'App\\Models\\Beneficiary',
            '--older' => '90 days',
        ])->weekly()->description('Prune soft-deleted beneficiaries');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
    }
}
