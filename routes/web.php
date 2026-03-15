<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\BeneficiaryController;
use App\Http\Controllers\JournalEntryController;
use App\Http\Controllers\TransferController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('transactions', function () {
    return Inertia::render('transactions');
})->middleware(['auth', 'verified'])->name('transactions');

Route::get('transfers', [TransferController::class, 'index'])->middleware(['auth', 'verified'])->name('transfers.index');
Route::get('transfers/create', [TransferController::class, 'create'])->middleware(['auth', 'verified'])->name('transfers.create');
Route::post('transfers', [TransferController::class, 'store'])->middleware(['auth', 'verified'])->name('transfers.store');
Route::get('transfers/balance-check', [TransferController::class, 'balanceCheck'])->middleware(['auth', 'verified'])->name('transfers.balance-check');
Route::get('transfers/{transfer}', [TransferController::class, 'show'])->middleware(['auth', 'verified'])->name('transfers.show');
Route::get('transfers/{transfer}/document.svg', [TransferController::class, 'documentSvg'])->middleware(['auth', 'verified'])->name('transfers.document.svg');
Route::get('transfers/{transfer}/document.pdf', [TransferController::class, 'documentPdf'])->middleware(['auth', 'verified'])->name('transfers.document.pdf');
Route::post('transfers/{transfer}/resend', [TransferController::class, 'resend'])->middleware(['auth', 'verified'])->name('transfers.resend');

Route::resource('beneficiaries', BeneficiaryController::class)->middleware(['auth', 'verified']);

Route::resource('bank-accounts', BankAccountController::class)->middleware(['auth', 'verified']);
Route::post('bank-accounts/{bank_account}/suspend', [BankAccountController::class, 'suspend'])->name('bank-accounts.suspend')->middleware(['auth', 'verified']);
Route::post('bank-accounts/{bank_account}/activate', [BankAccountController::class, 'activate'])->name('bank-accounts.activate')->middleware(['auth', 'verified']);

Route::get('journals', [JournalEntryController::class, 'index'])->middleware(['auth', 'verified'])->name('journals');
Route::get('journals/create', [JournalEntryController::class, 'create'])->middleware(['auth', 'verified'])->name('journals.create');
Route::post('journals', [JournalEntryController::class, 'store'])->middleware(['auth', 'verified'])->name('journals.store');

Route::get('audit-logs', [AuditLogController::class, 'index'])->middleware(['auth', 'verified'])->name('audit-logs');

require __DIR__.'/settings.php';
