<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\App;
use App\Http\Controllers\Settings\SmtpSettingsController;

// Test the multilingual email generation
echo "Testing SMTP Test Email Multilingual Support\n";
echo "=============================================\n\n";

// Test English locale
echo "Testing English locale:\n";
App::setLocale('en');
$englishEmail = SmtpSettingsController::buildTestEmailHtml('John Doe', 'en');
echo "✓ English email generated successfully\n";
echo "Subject: " . __('smtp.test_email.subject') . "\n";
echo "Greeting: " . __('smtp.test_email.greeting', ['name' => 'John Doe']) . "\n\n";

// Test Arabic locale
echo "Testing Arabic locale:\n";
App::setLocale('ar');
$arabicEmail = SmtpSettingsController::buildTestEmailHtml('جون دو', 'ar');
echo "✓ Arabic email generated successfully\n";
echo "Subject: " . __('smtp.test_email.subject') . "\n";
echo "Greeting: " . __('smtp.test_email.greeting', ['name' => 'جون دو']) . "\n\n";

// Check HTML direction attributes
echo "Checking HTML direction attributes:\n";
$englishHasDir = strpos($englishEmail, 'dir="ltr"') !== false;
$arabicHasDir = strpos($arabicEmail, 'dir="rtl"') !== false;

echo "English email has dir='ltr': " . ($englishHasDir ? "✓" : "✗") . "\n";
echo "Arabic email has dir='rtl': " . ($arabicHasDir ? "✓" : "✗") . "\n\n";

// Check language attributes
echo "Checking language attributes:\n";
$englishHasLang = strpos($englishEmail, 'lang="en"') !== false;
$arabicHasLang = strpos($arabicEmail, 'lang="ar"') !== false;

echo "English email has lang='en': " . ($englishHasLang ? "✓" : "✗") . "\n";
echo "Arabic email has lang='ar': " . ($arabicHasLang ? "✓" : "✗") . "\n\n";

echo "All tests completed!\n";
echo "The SMTP test email functionality now supports multilingual content based on user locale.\n";
