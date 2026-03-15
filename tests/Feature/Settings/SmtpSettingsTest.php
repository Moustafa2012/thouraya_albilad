<?php

use App\Enums\UserRole;
use App\Models\SmtpSetting;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\put;

test('smtp settings page is forbidden for non-advanced users', function () {
    $user = User::factory()->create(['role' => UserRole::VISITOR]);

    actingAs($user);

    get('/settings/smtp')->assertStatus(403);
});

test('super admin can update smtp settings', function () {
    $user = User::factory()->create(['role' => UserRole::SUPER_ADMIN]);

    actingAs($user);

    put('/settings/smtp', [
        'enabled' => true,
        'host' => 'smtp.example.com',
        'port' => 587,
        'username' => 'user@example.com',
        'password' => 'secret-password',
        'encryption' => 'tls',
        'from_address' => 'no-reply@example.com',
        'from_name' => 'Thouraya Albilad',
    ])->assertSessionHasNoErrors();

    $setting = SmtpSetting::query()->firstOrFail();

    expect($setting->enabled)->toBeTrue();
    expect($setting->host)->toBe('smtp.example.com');
    expect($setting->port)->toBe(587);
    expect($setting->username)->toBe('user@example.com');
    expect($setting->encryption)->toBe('tls');
    expect($setting->from_address)->toBe('no-reply@example.com');
    expect($setting->from_name)->toBe('Thouraya Albilad');

    expect($setting->password)->not->toBe('secret-password');
    expect(Crypt::decryptString($setting->password))->toBe('secret-password');
});
