<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transfers', function (Blueprint $table) {
            $table->string('authorized_by', 255)->nullable()->after('notes');
            $table->timestamp('sent_at')->nullable()->after('authorized_by');
            $table->foreignId('sent_by')->nullable()->after('sent_at')->constrained('users')->nullOnDelete();
            $table->string('sent_to', 255)->nullable()->after('sent_by');
        });
    }

    public function down(): void
    {
        Schema::table('transfers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('sent_by');
            $table->dropColumn(['authorized_by', 'sent_at', 'sent_to']);
        });
    }
};
