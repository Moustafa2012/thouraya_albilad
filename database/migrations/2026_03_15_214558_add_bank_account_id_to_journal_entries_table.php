<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('journal_entries', function (Blueprint $table) {
            $table->foreignId('bank_account_id')->nullable()->after('user_id')->constrained('bank_accounts')->nullOnDelete();
            $table->string('direction', 10)->nullable()->after('type'); // 'debit' | 'credit'
        });
    }

    public function down(): void
    {
        Schema::table('journal_entries', function (Blueprint $table) {
            $table->dropForeign(['bank_account_id']);
            $table->dropColumn('direction');
        });
    }
};
