<?php

namespace App\Services;

use App\Models\SmtpSetting;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Crypt;

class SmtpSettingsService
{
    public function getOrCreate(): ?SmtpSetting
    {
        try {
            return SmtpSetting::query()->first() ?? SmtpSetting::query()->create();
        } catch (QueryException) {
            return null;
        }
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function update(array $validated): ?SmtpSetting
    {
        $setting = $this->getOrCreate();
        if (! $setting) {
            return null;
        }

        $data = $validated;

        if (array_key_exists('password', $data)) {
            $password = is_string($data['password']) ? trim($data['password']) : '';

            if ($password === '') {
                unset($data['password']);
            } else {
                $data['password'] = Crypt::encryptString($password);
            }
        }

        $setting->fill($data);
        $setting->save();

        return $setting;
    }

    public function apply(): void
    {
        $setting = $this->getOrCreate();
        if (! $setting || ! $setting->enabled) {
            return;
        }

        $password = null;
        if (is_string($setting->password) && $setting->password !== '') {
            try {
                $password = Crypt::decryptString($setting->password);
            } catch (\Throwable) {
                $password = null;
            }
        }

        $smtp = array_filter([
            'transport' => 'smtp',
            'host' => $setting->host,
            'port' => $setting->port,
            'encryption' => $setting->encryption,
            'username' => $setting->username,
            'password' => $password,
            'timeout' => null,
            'local_domain' => null,
        ], fn ($value) => $value !== null);

        if ($smtp !== []) {
            config(['mail.default' => 'smtp']);
            config(['mail.mailers.smtp' => array_merge(config('mail.mailers.smtp', []), $smtp)]);
        }

        if ($setting->from_address) {
            config(['mail.from.address' => $setting->from_address]);
        }

        if ($setting->from_name) {
            config(['mail.from.name' => $setting->from_name]);
        }
    }
}
