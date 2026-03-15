<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'username' => $this->usernameRules($userId),
            'email' => $this->emailRules($userId),
            'phone' => $this->phoneRules($userId),
            'avatar' => $this->avatarRules(),
            'date_of_birth' => $this->dateOfBirthRules(),
            'gender' => $this->genderRules(),
            'nationality' => $this->nationalityRules(),
            'timezone' => $this->timezoneRules(),
            'locale' => $this->localeRules(),
            'bio' => $this->bioRules(),
            'address' => $this->addressRules(),
            'city' => $this->cityRules(),
            'state' => $this->stateRules(),
            'country' => $this->countryRules(),
            'postal_code' => $this->postalCodeRules(),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate usernames.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function usernameRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function phoneRules(?int $userId = null): array
    {
        return [
            'nullable',
            'string',
            'max:20',
            $userId === null
                ? Rule::unique(User::class)->whereNotNull('phone')
                : Rule::unique(User::class)->whereNotNull('phone')->ignore($userId),
        ];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function avatarRules(): array
    {
        return ['nullable', 'string', 'max:500', 'url'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function dateOfBirthRules(): array
    {
        return ['nullable', 'date'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function genderRules(): array
    {
        return ['nullable', 'string', 'in:male,female,other,prefer_not_to_say'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nationalityRules(): array
    {
        return ['nullable', 'string', 'max:50'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function timezoneRules(): array
    {
        return ['nullable', 'string', 'max:50'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function localeRules(): array
    {
        return ['nullable', 'string', 'max:10'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function bioRules(): array
    {
        return ['nullable', 'string', 'max:5000'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function addressRules(): array
    {
        return ['nullable', 'string', 'max:255'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function cityRules(): array
    {
        return ['nullable', 'string', 'max:100'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function stateRules(): array
    {
        return ['nullable', 'string', 'max:100'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function countryRules(): array
    {
        return ['nullable', 'string', 'max:100'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function postalCodeRules(): array
    {
        return ['nullable', 'string', 'max:20'];
    }
}
