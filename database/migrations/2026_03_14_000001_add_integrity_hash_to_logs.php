<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->string('integrity_hash', 64)->nullable()->after('user_agent');
            $table->index('integrity_hash');
        });

        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->string('integrity_hash', 64)->nullable()->after('is_suspicious');
            $table->index('integrity_hash');
        });
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['integrity_hash']);
            $table->dropColumn('integrity_hash');
        });

        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->dropIndex(['integrity_hash']);
            $table->dropColumn('integrity_hash');
        });
    }
};
