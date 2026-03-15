<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SmtpSettingsController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\Settings\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    Route::get('settings/users', [UserManagementController::class, 'index'])
        ->middleware('can:manage:users')
        ->name('settings.users');
    Route::patch('settings/users/{managedUser}', [UserManagementController::class, 'update'])
        ->middleware('can:manage:users')
        ->name('settings.users.update');

    Route::get('settings/smtp', [SmtpSettingsController::class, 'edit'])
        ->middleware('can:settings:advanced')
        ->name('settings.smtp.edit');
    Route::put('settings/smtp', [SmtpSettingsController::class, 'update'])
        ->middleware('can:settings:advanced')
        ->name('settings.smtp.update');
});
