<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bank_account_id')->constrained('bank_accounts')->cascadeOnDelete();
            $table->foreignId('beneficiary_id')->constrained('beneficiaries')->cascadeOnDelete();

            $table->decimal('amount', 15, 2);
            $table->string('currency', 10);
            $table->date('transfer_date');
            $table->string('reference_number', 80);
            $table->text('notes')->nullable();

            $table->string('bank_email')->nullable();
            $table->string('status')->default('submitted');
            $table->string('document_hash', 64)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
