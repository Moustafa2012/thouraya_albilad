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
        // Users table with comprehensive fields and relationships
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Basic Profile Information
            $table->string('username', 50)->nullable()->unique();
            $table->string('name', 100);
            $table->string('email', 100)->unique();
            $table->string('phone', 20)->nullable()->unique();
            $table->string('avatar', 500)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable();
            $table->string('nationality', 50)->nullable();
            $table->string('timezone', 50)->default('Asia/Riyadh');
            $table->string('locale', 10)->default('en');
            $table->text('bio')->nullable();
            $table->string('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('postal_code', 20)->nullable();

            // Authentication & Security
            $table->string('password');
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->string('two_factor_method')->nullable(); // 'app', 'sms', 'email'
            $table->rememberToken();

            // Verification Status
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('email_verification_token', 100)->nullable()->unique();
            $table->string('phone_verification_token', 20)->nullable();
            $table->timestamp('email_verification_sent_at')->nullable();
            $table->timestamp('phone_verification_sent_at')->nullable();

            // Account Security & Status
            $table->integer('login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->timestamp('password_changed_at')->nullable();
            $table->boolean('force_password_change')->default(false);
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->text('last_login_user_agent')->nullable();
            $table->string('last_login_device')->nullable();
            $table->string('last_login_location')->nullable();

            // Authorization & Permissions
            $table->string('role', 50)->default('visitor');
            $table->json('permissions')->nullable();
            $table->json('settings')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_banned')->default(false);
            $table->boolean('is_super_admin')->default(false);
            $table->text('ban_reason')->nullable();
            $table->timestamp('banned_at')->nullable();
            $table->unsignedBigInteger('banned_by')->nullable();

            // Professional/Company Information
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->string('employee_id', 50)->nullable()->unique();
            $table->string('job_title', 100)->nullable();
            $table->text('job_description')->nullable();
            $table->decimal('salary', 12, 2)->nullable();
            $table->string('employment_type', 50)->nullable(); // full-time, part-time, contract, etc.
            $table->string('employment_status', 50)->default('active'); // active, on_leave, terminated, etc.
            $table->date('hired_at')->nullable();
            $table->date('contract_end_at')->nullable();
            $table->date('terminated_at')->nullable();

            // Preferences & Notifications
            $table->boolean('email_notifications_enabled')->default(true);
            $table->boolean('sms_notifications_enabled')->default(true);
            $table->boolean('push_notifications_enabled')->default(true);
            $table->json('notification_preferences')->nullable();
            $table->string('preferred_contact_method', 20)->default('email'); // email, phone, sms

            // Privacy Settings
            $table->boolean('profile_public')->default(false);
            $table->boolean('show_email')->default(false);
            $table->boolean('show_phone')->default(false);
            $table->boolean('allow_messages')->default(true);

            // Tracking & Audit
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->string('created_ip', 45)->nullable();
            $table->string('updated_ip', 45)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            // Performance Indexes
            $table->index('username');
            $table->index('email');
            $table->index('phone');
            $table->index('role');
            $table->index('is_active');
            $table->index('is_super_admin');
            $table->index('is_banned');
            $table->index('is_verified');
            $table->index(['email', 'is_active']);
            $table->index(['role', 'is_active']);
            $table->index(['company_id', 'department_id']);
            $table->index(['company_id', 'is_active']);
            $table->index('created_at');
            $table->index('updated_at');
            $table->index('deleted_at');
            $table->index('last_login_at');
            $table->index('hired_at');
            $table->index('employee_id');
            $table->index(['employment_status', 'is_active']);

            // Composite Indexes for common queries
            $table->index(['company_id', 'department_id', 'is_active'], 'users_company_dept_active_idx');
            $table->index(['role', 'is_active', 'created_at'], 'users_role_active_created_idx');
        });

        // Add foreign key constraints after table creation to avoid circular dependencies
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('company_id')->references('id')->on('companies')->nullOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            $table->foreign('manager_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('banned_by')->references('id')->on('users')->nullOnDelete();
        });

        // Password reset tokens table
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 100);
            $table->string('token', 100);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('used')->default(false);
            $table->timestamp('used_at')->nullable();
            $table->string('ip_address', 45)->nullable();

            $table->primary('email');
            $table->index('token');
            $table->index('created_at');
            $table->index('expires_at');
            $table->index(['email', 'used']);
        });

        // Sessions table with enhanced tracking
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->string('device_name')->nullable();
            $table->string('device_type', 50)->nullable(); // desktop, mobile, tablet
            $table->string('browser', 50)->nullable();
            $table->string('browser_version', 20)->nullable();
            $table->string('platform', 50)->nullable(); // Windows, macOS, Linux, iOS, Android
            $table->string('platform_version', 20)->nullable();
            $table->boolean('is_robot')->default(false);
            $table->string('location')->nullable();
            $table->string('country_code', 10)->nullable();
            $table->integer('last_activity');
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_current')->default(false);
            $table->boolean('trusted_device')->default(false);

            // Performance Indexes
            $table->index('user_id');
            $table->index('last_activity');
            $table->index('last_used_at');
            $table->index('created_at');
            $table->index('expires_at');
            $table->index('ip_address');
            $table->index(['user_id', 'last_activity'], 'sessions_user_activity_idx');
            $table->index(['user_id', 'is_current'], 'sessions_user_current_idx');
            $table->index(['user_id', 'trusted_device'], 'sessions_user_trusted_idx');
            $table->index(['device_type', 'platform'], 'sessions_device_platform_idx');
        });

        // User activity logs table with comprehensive tracking
        Schema::create('user_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('action', 100); // login, logout, profile_update, password_change, etc.
            $table->string('entity_type')->nullable(); // User, Post, Comment, etc.
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->text('description')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type', 50)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('platform', 50)->nullable();
            $table->string('location')->nullable();
            $table->string('country_code', 10)->nullable();
            $table->string('session_id', 100)->nullable();
            $table->string('request_method', 10)->nullable(); // GET, POST, PUT, DELETE, etc.
            $table->string('request_url')->nullable();
            $table->integer('response_code')->nullable();
            $table->string('severity', 20)->default('info'); // info, warning, error, critical
            $table->boolean('is_suspicious')->default(false);
            $table->timestamp('created_at');

            // Performance Indexes
            $table->index('user_id');
            $table->index('action');
            $table->index('entity_type');
            $table->index('entity_id');
            $table->index('created_at');
            $table->index('ip_address');
            $table->index('session_id');
            $table->index('severity');
            $table->index('is_suspicious');
            $table->index(['user_id', 'created_at'], 'activity_user_created_idx');
            $table->index(['action', 'created_at'], 'activity_action_created_idx');
            $table->index(['user_id', 'action', 'created_at'], 'activity_user_action_created_idx');
            $table->index(['entity_type', 'entity_id'], 'activity_entity_idx');
            $table->index(['is_suspicious', 'created_at'], 'activity_suspicious_created_idx');

            // Foreign key for session tracking
            $table->foreign('session_id')->references('id')->on('sessions')->nullOnDelete();
        });

        // User login history table for security tracking
        Schema::create('user_login_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45);
            $table->text('user_agent');
            $table->string('device_type', 50)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('platform', 50)->nullable();
            $table->string('location')->nullable();
            $table->string('country_code', 10)->nullable();
            $table->boolean('successful')->default(true);
            $table->string('failure_reason')->nullable();
            $table->string('two_factor_method')->nullable();
            $table->boolean('two_factor_passed')->nullable();
            $table->boolean('is_suspicious')->default(false);
            $table->timestamp('login_at');
            $table->timestamp('logout_at')->nullable();
            $table->integer('session_duration')->nullable(); // in seconds

            // Performance Indexes
            $table->index('user_id');
            $table->index('login_at');
            $table->index('logout_at');
            $table->index('successful');
            $table->index('is_suspicious');
            $table->index('ip_address');
            $table->index(['user_id', 'login_at'], 'login_history_user_login_idx');
            $table->index(['user_id', 'successful'], 'login_history_user_success_idx');
            $table->index(['ip_address', 'successful'], 'login_history_ip_success_idx');
            $table->index(['is_suspicious', 'login_at'], 'login_history_suspicious_idx');
        });

        // User preferences table for extensible settings
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('key', 100);
            $table->text('value')->nullable();
            $table->string('type', 20)->default('string'); // string, integer, boolean, json, etc.
            $table->string('category', 50)->nullable(); // notification, privacy, display, etc.
            $table->timestamps();

            // Performance Indexes
            $table->unique(['user_id', 'key']);
            $table->index('user_id');
            $table->index('key');
            $table->index('category');
            $table->index(['user_id', 'category'], 'preferences_user_category_idx');
        });

        // User device tokens for push notifications
        Schema::create('user_device_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('token', 500);
            $table->string('device_type', 50); // ios, android, web
            $table->string('device_name')->nullable();
            $table->string('app_version', 20)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            // Performance Indexes
            $table->index('user_id');
            $table->index('token');
            $table->index('device_type');
            $table->index('is_active');
            $table->index(['user_id', 'is_active'], 'device_tokens_user_active_idx');
            $table->index(['user_id', 'device_type'], 'device_tokens_user_type_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_device_tokens');
        Schema::dropIfExists('user_preferences');
        Schema::dropIfExists('user_login_history');
        Schema::dropIfExists('user_activity_logs');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
