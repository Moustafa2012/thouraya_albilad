<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_bank_accounts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('bank_account_id')->constrained('bank_accounts')->cascadeOnDelete()->unique();
            $table->timestamps();
        });

        Schema::create('business_bank_accounts', function (Blueprint $table): void {
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
            $table->index('commercial_reg_number');
            $table->index('vat_number');
        });

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
            $table->index('commercial_reg_number');
            $table->index('vat_number');
        });

        Schema::create('savings_bank_accounts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('bank_account_id')->constrained('bank_accounts')->cascadeOnDelete()->unique();
            $table->boolean('joint_account')->default(false);
            $table->string('joint_holder_name', 255)->nullable();
            $table->timestamps();
        });

        DB::table('bank_accounts')
            ->orderBy('id')
            ->select(['id', 'account_category', 'metadata'])
            ->chunkById(100, function ($accounts): void {
                foreach ($accounts as $account) {
                    $metadata = $account->metadata;

                    if (is_string($metadata)) {
                        $decoded = json_decode($metadata, true);
                        $metadata = is_array($decoded) ? $decoded : [];
                    }

                    if (! is_array($metadata)) {
                        $metadata = [];
                    }

                    if ($account->account_category === 'personal') {
                        DB::table('personal_bank_accounts')->updateOrInsert(
                            ['bank_account_id' => $account->id],
                            [
                                'created_at' => now(),
                                'updated_at' => now(),
                            ],
                        );
                    }

                    if ($account->account_category === 'business') {
                        DB::table('business_bank_accounts')->updateOrInsert(
                            ['bank_account_id' => $account->id],
                            [
                                'establishment_type' => $metadata['establishment_type'] ?? null,
                                'business_sector' => $metadata['business_sector'] ?? null,
                                'business_activity' => $metadata['business_activity'] ?? null,
                                'commercial_reg_number' => $metadata['commercial_reg_number'] ?? null,
                                'vat_number' => $metadata['vat_number'] ?? null,
                                'authorized_signatory_name' => $metadata['authorized_signatory_name'] ?? null,
                                'authorized_signatory_id' => $metadata['authorized_signatory_id'] ?? null,
                                'signatory_position' => $metadata['signatory_position'] ?? null,
                                'beneficial_ownership_percentage' => isset($metadata['beneficial_ownership_percentage'])
                                    ? (float) $metadata['beneficial_ownership_percentage']
                                    : null,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ],
                        );
                    }

                    if ($account->account_category === 'finance') {
                        DB::table('finance_bank_accounts')->updateOrInsert(
                            ['bank_account_id' => $account->id],
                            [
                                'establishment_type' => $metadata['establishment_type'] ?? null,
                                'business_sector' => $metadata['business_sector'] ?? null,
                                'business_activity' => $metadata['business_activity'] ?? null,
                                'commercial_reg_number' => $metadata['commercial_reg_number'] ?? null,
                                'vat_number' => $metadata['vat_number'] ?? null,
                                'authorized_signatory_name' => $metadata['authorized_signatory_name'] ?? null,
                                'authorized_signatory_id' => $metadata['authorized_signatory_id'] ?? null,
                                'signatory_position' => $metadata['signatory_position'] ?? null,
                                'beneficial_ownership_percentage' => isset($metadata['beneficial_ownership_percentage'])
                                    ? (float) $metadata['beneficial_ownership_percentage']
                                    : null,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ],
                        );
                    }

                    if ($account->account_category === 'savings') {
                        DB::table('savings_bank_accounts')->updateOrInsert(
                            ['bank_account_id' => $account->id],
                            [
                                'joint_account' => (bool) ($metadata['joint_account'] ?? false),
                                'joint_holder_name' => $metadata['joint_holder_name'] ?? null,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ],
                        );
                    }
                }
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('savings_bank_accounts');
        Schema::dropIfExists('finance_bank_accounts');
        Schema::dropIfExists('business_bank_accounts');
        Schema::dropIfExists('personal_bank_accounts');
    }
};
