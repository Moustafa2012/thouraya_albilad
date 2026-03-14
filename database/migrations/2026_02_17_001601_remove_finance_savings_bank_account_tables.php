<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Remove finance and savings accounts from the main table (soft-delete them)
        DB::table('bank_accounts')
            ->whereIn('account_category', ['finance', 'savings'])
            ->update(['deleted_at' => now()]);

        // Drop the specialized tables that are no longer needed
        Schema::dropIfExists('finance_bank_accounts');
        Schema::dropIfExists('savings_bank_accounts');
    }

    public function down(): void
    {
        Schema::create('finance_bank_accounts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('bank_account_id')->constrained('bank_accounts')->cascadeOnDelete()->unique();
            $table->string('establishment_type', 100)->nullable();
            $table->string('business_sector', 150)->nullable();
            $table->text('business_activity')->nullable();
            $table->string('commercial_reg_number', 20)->nullable();
            $table->string('vat_number', 20)->nullable();
            $table->string('authorized_signatory_name', 255)->nullable();
            $table->string('authorized_signatory_id', 50)->nullable();
            $table->string('signatory_position', 150)->nullable();
            $table->decimal('beneficial_ownership_percentage', 5, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('savings_bank_accounts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('bank_account_id')->constrained('bank_accounts')->cascadeOnDelete()->unique();
            $table->boolean('joint_account')->default(false);
            $table->string('joint_holder_name', 255)->nullable();
            $table->timestamps();
        });
    }
};
