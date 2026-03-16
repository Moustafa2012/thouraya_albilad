<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\BeneficiaryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JournalEntryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransferController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/bank-statement', [ReportController::class, 'bankStatement'])->name('reports.bank-statement');
    Route::get('reports/beneficiary-statement', [ReportController::class, 'beneficiaryStatement'])->name('reports.beneficiary-statement');
    Route::get('reports/summary', [ReportController::class, 'summary'])->name('reports.summary');

    Route::get('transactions', function () {
        return Inertia::render('transactions');
    })->name('transactions');

    Route::get('transfers', [TransferController::class, 'index'])->name('transfers.index');
    Route::get('transfers/create', [TransferController::class, 'create'])->name('transfers.create');
    Route::post('transfers', [TransferController::class, 'store'])->name('transfers.store');
    Route::post('transfers/preview.svg', [TransferController::class, 'previewSvg'])->name('transfers.preview.svg');
    Route::get('transfers/balance-check', [TransferController::class, 'balanceCheck'])->name('transfers.balance-check');
    Route::get('transfers/{transfer}', [TransferController::class, 'show'])->name('transfers.show');
    Route::get('transfers/{transfer}/document.svg', [TransferController::class, 'documentSvg'])->name('transfers.document.svg');
    Route::get('transfers/{transfer}/document.pdf', [TransferController::class, 'documentPdf'])->name('transfers.document.pdf');
    Route::post('transfers/{transfer}/resend', [TransferController::class, 'resend'])->name('transfers.resend');

    Route::resource('beneficiaries', BeneficiaryController::class);

    Route::resource('bank-accounts', BankAccountController::class);
    Route::post('bank-accounts/{bank_account}/suspend', [BankAccountController::class, 'suspend'])->name('bank-accounts.suspend');
    Route::post('bank-accounts/{bank_account}/activate', [BankAccountController::class, 'activate'])->name('bank-accounts.activate');

    Route::get('journals', [JournalEntryController::class, 'index'])->name('journals');
    Route::get('journals/create', [JournalEntryController::class, 'create'])->name('journals.create');
    Route::post('journals', [JournalEntryController::class, 'store'])->name('journals.store');

    Route::prefix('audit-logs')->name('audit-logs.')->group(function () {
        Route::get('/', [AuditLogController::class, 'index'])->name('index');
        Route::get('/stats', [AuditLogController::class, 'stats'])->name('stats');
        Route::get('/export', [AuditLogController::class, 'export'])->name('export');
    });
});

require __DIR__.'/settings.php';
