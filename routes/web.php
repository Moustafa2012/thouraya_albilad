<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\BeneficiaryController;
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

Route::resource('beneficiaries', BeneficiaryController::class)->middleware(['auth', 'verified']);

Route::resource('bank-accounts', BankAccountController::class)->middleware(['auth', 'verified']);
Route::post('bank-accounts/{bank_account}/suspend', [BankAccountController::class, 'suspend'])->name('bank-accounts.suspend')->middleware(['auth', 'verified']);
Route::post('bank-accounts/{bank_account}/activate', [BankAccountController::class, 'activate'])->name('bank-accounts.activate')->middleware(['auth', 'verified']);

Route::get('journals', function () {
    return Inertia::render('journals');
})->middleware(['auth', 'verified'])->name('journals');

Route::get('audit-logs', [AuditLogController::class, 'index'])->middleware(['auth', 'verified'])->name('audit-logs');

require __DIR__.'/settings.php';
