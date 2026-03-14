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
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('account_type'); // individual, business
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('national_id')->nullable();
            $table->string('business_registration')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('country');
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('iban');
            $table->string('swift_code');
            $table->string('currency');
            $table->string('aba_number')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('sort_code')->nullable();
            $table->string('bsb_number')->nullable();
            $table->string('transit_number')->nullable();
            $table->string('category');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beneficiaries');
    }
};
