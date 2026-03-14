<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add common fields to bank_accounts
        Schema::table('bank_accounts', function (Blueprint $table) {
            if (! Schema::hasColumn('bank_accounts', 'account_name')) {
                $table->string('account_name')->after('id')->nullable(); // Account nickname or label
            }
        });

        // 2. Update personal_bank_accounts
        Schema::table('personal_bank_accounts', function (Blueprint $table) {
            if (! Schema::hasColumn('personal_bank_accounts', 'account_holder_name')) {
                $table->string('account_holder_name')->nullable();
            }
            if (! Schema::hasColumn('personal_bank_accounts', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable();
            }
            if (! Schema::hasColumn('personal_bank_accounts', 'ssn_last_4')) {
                $table->string('ssn_last_4', 4)->nullable();
            }
        });

        // 3. Update business_bank_accounts
        Schema::table('business_bank_accounts', function (Blueprint $table) {
            if (! Schema::hasColumn('business_bank_accounts', 'business_name')) {
                $table->string('business_name')->nullable();
            }
            if (! Schema::hasColumn('business_bank_accounts', 'business_type')) {
                $table->string('business_type')->nullable(); // e.g. LLC, Corp
            }
            if (! Schema::hasColumn('business_bank_accounts', 'tax_id')) {
                $table->string('tax_id')->nullable();
            }
            if (! Schema::hasColumn('business_bank_accounts', 'business_address')) {
                $table->string('business_address')->nullable();
            }
            if (! Schema::hasColumn('business_bank_accounts', 'business_phone')) {
                $table->string('business_phone')->nullable();
            }
        });

        // Data Migration: Map existing data using SQLite compatible queries
        // Map holder_name_en to account_holder_name for Personal
        // We use raw SQL for SQLite compatibility
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('
                UPDATE personal_bank_accounts 
                SET account_holder_name = (
                    SELECT holder_name_en FROM bank_accounts WHERE bank_accounts.id = personal_bank_accounts.bank_account_id
                )
            ');

            // For business fields
            // business_type <- establishment_type
            // tax_id <- vat_number
            // business_name <- holder_name_en
            DB::statement('
                UPDATE business_bank_accounts 
                SET 
                    business_type = establishment_type,
                    tax_id = vat_number,
                    business_name = (
                        SELECT holder_name_en FROM bank_accounts WHERE bank_accounts.id = business_bank_accounts.bank_account_id
                    )
            ');
        } else {
            // Fallback for other drivers (e.g. MySQL) using joins if needed,
            // but the subquery approach is generally standard SQL and works on MySQL too.
            // So we can use the same logic or the Laravel builder for safety.
            DB::table('personal_bank_accounts')
                ->join('bank_accounts', 'personal_bank_accounts.bank_account_id', '=', 'bank_accounts.id')
                ->update(['account_holder_name' => DB::raw('bank_accounts.holder_name_en')]);

            DB::table('business_bank_accounts')
                ->join('bank_accounts', 'business_bank_accounts.bank_account_id', '=', 'bank_accounts.id')
                ->update([
                    'business_type' => DB::raw('establishment_type'),
                    'tax_id' => DB::raw('vat_number'),
                    'business_name' => DB::raw('bank_accounts.holder_name_en'),
                ]);
        }

        // 4. Drop specialized tables if they still exist (Finance/Savings)
        Schema::dropIfExists('finance_bank_accounts');
        Schema::dropIfExists('savings_bank_accounts');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bank_accounts', function (Blueprint $table) {
            $table->dropColumn(['account_name']);
        });

        Schema::table('personal_bank_accounts', function (Blueprint $table) {
            $table->dropColumn(['account_holder_name', 'date_of_birth', 'ssn_last_4']);
        });

        Schema::table('business_bank_accounts', function (Blueprint $table) {
            $table->dropColumn(['business_name', 'business_type', 'tax_id', 'business_address', 'business_phone']);
        });

        // Note: Dropped tables (finance/savings) are not easily restored without their original schema definition here.
    }
};
