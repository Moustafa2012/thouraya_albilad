<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('smtp_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(false);
            $table->string('host', 255)->nullable();
            $table->unsignedInteger('port')->nullable();
            $table->string('username', 255)->nullable();
            $table->text('password')->nullable();
            $table->string('encryption', 20)->nullable();
            $table->string('from_address', 255)->nullable();
            $table->string('from_name', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('smtp_settings');
    }
};
