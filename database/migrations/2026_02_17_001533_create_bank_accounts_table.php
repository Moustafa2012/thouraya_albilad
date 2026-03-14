<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();

            // Ownership
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained()->nullOnDelete();

            // Account Holder Details
            $table->string('holder_name_ar');
            $table->string('holder_name_en');
            $table->string('holder_id_type')->nullable(); // national_id, passport, etc.
            $table->string('holder_id')->nullable();

            // Bank Details
            $table->string('bank_name');
            $table->string('bank_country')->nullable();
            $table->string('bank_address')->nullable();
            $table->string('bank_phone')->nullable();
            $table->string('bank_email')->nullable();

            // Account Details
            $table->string('account_number')->index();
            $table->string('iban')->unique();
            $table->string('swift_code')->nullable();
            $table->string('currency', 3); // ISO 4217
            $table->string('branch_name')->nullable();
            $table->string('branch_code')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('sort_code')->nullable();

            // Classification
            $table->string('account_type'); // current, savings, etc.
            $table->string('account_category'); // personal, business, etc.

            // Status & Flags
            $table->decimal('balance', 15, 2)->default(0);
            $table->string('status')->default('active'); // active, suspended, inactive
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);

            // Additional Info
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // For flexible fields like establishmentType, businessSector, etc.

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
