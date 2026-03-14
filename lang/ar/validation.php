<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'يجب قبول حقل :attribute.',
    'accepted_if' => 'يجب قبول حقل :attribute عندما يكون :other هو :value.',
    'active_url' => 'حقل :attribute يجب أن يكون رابط URL صالح.',
    'after' => 'حقل :attribute يجب أن يكون تاريخاً بعد :date.',
    'after_or_equal' => 'حقل :attribute يجب أن يكون تاريخاً بعد أو يساوي :date.',
    'alpha' => 'حقل :attribute يجب أن يحتوي على أحرف فقط.',
    'alpha_dash' => 'حقل :attribute يجب أن يحتوي على أحرف وأرقام وشرطات وشرطات سفلية فقط.',
    'alpha_num' => 'حقل :attribute يجب أن يحتوي على أحرف وأرقام فقط.',
    'any_of' => 'حقل :attribute غير صالح.',
    'array' => 'حقل :attribute يجب أن يكون مصفوفة.',
    'ascii' => 'حقل :attribute يجب أن يحتوي على أحرف وأرقام ورموز بايت واحد فقط.',
    'before' => 'حقل :attribute يجب أن يكون تاريخاً قبل :date.',
    'before_or_equal' => 'حقل :attribute يجب أن يكون تاريخاً قبل أو يساوي :date.',
    'between' => [
        'array' => 'حقل :attribute يجب أن يحتوي على بين :min و :max عناصر.',
        'file' => 'حقل :attribute يجب أن يكون بين :min و :max كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن يكون بين :min و :max.',
        'string' => 'حقل :attribute يجب أن يكون بين :min و :max حرف.',
    ],
    'boolean' => 'حقل :attribute يجب أن يكون true أو false.',
    'can' => 'حقل :attribute يحتوي على قيمة غير مصرح بها.',
    'confirmed' => 'تأكيد حقل :attribute لا يتطابق.',
    'contains' => 'حقل :attribute يفتقد إلى قيمة مطلوبة.',
    'current_password' => 'كلمة المرور غير صحيحة.',
    'date' => 'حقل :attribute يجب أن يكون تاريخاً صالحاً.',
    'date_equals' => 'حقل :attribute يجب أن يكون تاريخاً يساوي :date.',
    'date_format' => 'حقل :attribute يجب أن يتطابق مع التنسيق :format.',
    'decimal' => 'حقل :attribute يجب أن يحتوي على :decimal منزلة عشرية.',
    'declined' => 'يجب رفض حقل :attribute.',
    'declined_if' => 'يجب رفض حقل :attribute عندما يكون :other هو :value.',
    'different' => 'حقل :attribute و :other يجب أن يكونا مختلفين.',
    'digits' => 'حقل :attribute يجب أن يكون :digits رقم.',
    'digits_between' => 'حقل :attribute يجب أن يكون بين :min و :max رقم.',
    'dimensions' => 'حقل :attribute لديه أبعاد صورة غير صالحة.',
    'distinct' => 'حقل :attribute لديه قيمة مكررة.',
    'doesnt_contain' => 'حقل :attribute يجب أن لا يحتوي على أي من: :values.',
    'doesnt_end_with' => 'حقل :attribute يجب أن لا ينتهي بأي من: :values.',
    'doesnt_start_with' => 'حقل :attribute يجب أن لا يبدأ بأي من: :values.',
    'email' => 'حقل :attribute يجب أن يكون عنوان بريد إلكتروني صالح.',
    'encoding' => 'حقل :attribute يجب أن يكون مشفراً بـ :encoding.',
    'ends_with' => 'حقل :attribute يجب أن ينتهي بأي من: :values.',
    'enum' => ':attribute المحدد غير صالح.',
    'exists' => ':attribute المحدد غير صالح.',
    'extensions' => 'حقل :attribute يجب أن يكون لديه أحد الامتدادات التالية: :values.',
    'file' => 'حقل :attribute يجب أن يكون ملفاً.',
    'filled' => 'حقل :attribute يجب أن يحتوي على قيمة.',
    'gt' => [
        'array' => 'حقل :attribute يجب أن يحتوي على أكثر من :value عنصر.',
        'file' => 'حقل :attribute يجب أن يكون أكبر من :value كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن يكون أكبر من :value.',
        'string' => 'حقل :attribute يجب أن يكون أكبر من :value حرف.',
    ],
    'gte' => [
        'array' => 'حقل :attribute يجب أن يحتوي على :value عنصر أو أكثر.',
        'file' => 'حقل :attribute يجب أن يكون أكبر من أو يساوي :value كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن يكون أكبر من أو يساوي :value.',
        'string' => 'حقل :attribute يجب أن يكون أكبر من أو يساوي :value حرف.',
    ],
    'hex_color' => 'حقل :attribute يجب أن يكون لوناً سداسياً صالحاً.',
    'image' => 'حقل :attribute يجب أن يكون صورة.',
    'in' => ':attribute المحدد غير صالح.',
    'in_array' => 'حقل :attribute يجب أن موجود في :other.',
    'in_array_keys' => 'حقل :attribute يجب أن يحتوي على أحد المفاتيح التالية: :values.',
    'integer' => 'حقل :attribute يجب أن يكون عدداً صحيحاً.',
    'ip' => 'حقل :attribute يجب أن يكون عنوان IP صالح.',
    'ipv4' => 'حقل :attribute يجب أن يكون عنوان IPv4 صالح.',
    'ipv6' => 'حقل :attribute يجب أن يكون عنوان IPv6 صالح.',
    'json' => 'حقل :attribute يجب أن يكون سلسلة JSON صالحة.',
    'list' => 'حقل :attribute يجب أن يكون قائمة.',
    'lowercase' => 'حقل :attribute يجب أن يكون أحرف صغيرة.',
    'lt' => [
        'array' => 'حقل :attribute يجب أن يحتوي على أقل من :value عنصر.',
        'file' => 'حقل :attribute يجب أن يكون أقل من :value كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن يكون أقل من :value.',
        'string' => 'حقل :attribute يجب أن يكون أقل من :value حرف.',
    ],
    'lte' => [
        'array' => 'حقل :attribute يجب أن لا يحتوي على أكثر من :value عنصر.',
        'file' => 'حقل :attribute يجب أن يكون أقل من أو يساوي :value كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن يكون أقل من أو يساوي :value.',
        'string' => 'حقل :attribute يجب أن يكون أقل من أو يساوي :value حرف.',
    ],
    'mac_address' => 'حقل :attribute يجب أن يكون عنوان MAC صالح.',
    'max' => [
        'array' => 'حقل :attribute يجب أن لا يحتوي على أكثر من :max عنصر.',
        'file' => 'حقل :attribute يجب أن لا يكون أكبر من :max كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن لا يكون أكبر من :max.',
        'string' => 'حقل :attribute يجب أن لا يكون أكبر من :max حرف.',
    ],
    'max_digits' => 'حقل :attribute يجب أن لا يحتوي على أكثر من :max رقم.',
    'mimes' => 'حقل :attribute يجب أن يكون ملفاً من النوع: :values.',
    'mimetypes' => 'حقل :attribute يجب أن يكون ملفاً من النوع: :values.',
    'min' => [
        'array' => 'حقل :attribute يجب أن يحتوي على الأقل :min عنصر.',
        'file' => 'حقل :attribute يجب أن يكون على الأقل :min كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن يكون على الأقل :min.',
        'string' => 'حقل :attribute يجب أن يكون على الأقل :min حرف.',
    ],
    'min_digits' => 'حقل :attribute يجب أن يحتوي على الأقل :min رقم.',
    'missing' => 'حقل :attribute يجب أن يكون مفقوداً.',
    'missing_if' => 'حقل :attribute يجب أن يكون مفقوداً عندما يكون :other هو :value.',
    'missing_unless' => 'حقل :attribute يجب أن يكون مفقوداً إلا إذا كان :other هو :value.',
    'missing_with' => 'حقل :attribute يجب أن يكون مفقوداً عندما يكون :values موجود.',
    'missing_with_all' => 'حقل :attribute يجب أن يكون مفقوداً عندما تكون :values موجودة.',
    'multiple_of' => 'حقل :attribute يجب أن يكون مضاعفاً من :value.',
    'not_in' => ':attribute المحدد غير صالح.',
    'not_regex' => 'تنسيق حقل :attribute غير صالح.',
    'numeric' => 'حقل :attribute يجب أن يكون رقماً.',
    'password' => [
        'letters' => 'حقل :attribute يجب أن يحتوي على الأقل حرف واحد.',
        'mixed' => 'حقل :attribute يجب أن يحتوي على الأقل حرف كبير واحد وحرف صغير واحد.',
        'numbers' => 'حقل :attribute يجب أن يحتوي على الأقل رقم واحد.',
        'symbols' => 'حقل :attribute يجب أن يحتوي على الأقل رمز واحد.',
        'uncompromised' => ':attribute المحدد ظهر في تسريب بيانات. يرجى اختيار :attribute مختلف.',
    ],
    'present' => 'حقل :attribute يجب أن يكون موجوداً.',
    'present_if' => 'حقل :attribute يجب أن يكون موجوداً عندما يكون :other هو :value.',
    'present_unless' => 'حقل :attribute يجب أن يكون موجوداً إلا إذا كان :other هو :value.',
    'present_with' => 'حقل :attribute يجب أن يكون موجوداً عندما يكون :values موجود.',
    'present_with_all' => 'حقل :attribute يجب أن يكون موجوداً عندما تكون :values موجودة.',
    'prohibited' => 'حقل :attribute ممنوع.',
    'prohibited_if' => 'حقل :attribute ممنوع عندما يكون :other هو :value.',
    'prohibited_if_accepted' => 'حقل :attribute ممنوع عندما يكون :other مقبولاً.',
    'prohibited_if_declined' => 'حقل :attribute ممنوع عندما يكون :other مرفوضاً.',
    'prohibited_unless' => 'حقل :attribute ممنوع إلا إذا كان :other في :values.',
    'prohibits' => 'حقل :attribute يمنع وجود :other.',
    'regex' => 'تنسيق حقل :attribute غير صالح.',
    'required' => 'حقل :attribute مطلوب.',
    'required_array_keys' => 'حقل :attribute يجب أن يحتوي على مدخلات لـ: :values.',
    'required_if' => 'حقل :attribute مطلوب عندما يكون :other هو :value.',
    'required_if_accepted' => 'حقل :attribute مطلوب عندما يكون :other مقبولاً.',
    'required_if_declined' => 'حقل :attribute مطلوب عندما يكون :other مرفوضاً.',
    'required_unless' => 'حقل :attribute مطلوب إلا إذا كان :other في :values.',
    'required_with' => 'حقل :attribute مطلوب عندما يكون :values موجود.',
    'required_with_all' => 'حقل :attribute مطلوب عندما تكون :values موجودة.',
    'required_without' => 'حقل :attribute مطلوب عندما لا يكون :values موجود.',
    'required_without_all' => 'حقل :attribute مطلوب عندما لا تكون أي من :values موجودة.',
    'same' => 'حقل :attribute يجب أن يتطابق مع :other.',
    'size' => [
        'array' => 'حقل :attribute يجب أن يحتوي على :size عنصر.',
        'file' => 'حقل :attribute يجب أن يكون :size كيلوبايت.',
        'numeric' => 'حقل :attribute يجب أن يكون :size.',
        'string' => 'حقل :attribute يجب أن يكون :size حرف.',
    ],
    'starts_with' => 'حقل :attribute يجب أن يبدأ بأي من: :values.',
    'string' => 'حقل :attribute يجب أن يكون سلسلة نصية.',
    'timezone' => 'حقل :attribute يجب أن يكون منطقة زمنية صالحة.',
    'unique' => ':attribute تم أخذه بالفعل.',
    'uploaded' => 'فشل رفع :attribute.',
    'uppercase' => 'حقل :attribute يجب أن يكون أحرف كبيرة.',
    'url' => 'حقل :attribute يجب أن يكون رابط URL صالح.',
    'ulid' => 'حقل :attribute يجب أن يكون ULID صالح.',
    'uuid' => 'حقل :attribute يجب أن يكون UUID صالح.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
