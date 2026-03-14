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
        // Add composite indexes for user_activity_logs
        Schema::table('user_activity_logs', function (Blueprint $table) {
            if (! Schema::hasIndex('user_activity_logs', 'user_activity_logs_user_action_created_idx')) {
                $table->index(['user_id', 'action', 'created_at'], 'user_activity_logs_user_action_created_idx');
            }
            if (! Schema::hasIndex('user_activity_logs', 'user_activity_logs_suspicious_created_idx')) {
                $table->index(['is_suspicious', 'created_at'], 'user_activity_logs_suspicious_created_idx');
            }
            if (! Schema::hasIndex('user_activity_logs', 'user_activity_logs_action_created_idx')) {
                $table->index(['action', 'created_at'], 'user_activity_logs_action_created_idx');
            }
        });

        // Add composite indexes for user_login_history
        Schema::table('user_login_history', function (Blueprint $table) {
            if (! Schema::hasIndex('user_login_history', 'user_login_history_user_login_successful_idx')) {
                $table->index(['user_id', 'login_at', 'successful'], 'user_login_history_user_login_successful_idx');
            }
            if (! Schema::hasIndex('user_login_history', 'user_login_history_ip_success_login_idx')) {
                $table->index(['ip_address', 'successful', 'login_at'], 'user_login_history_ip_success_login_idx');
            }
            if (! Schema::hasIndex('user_login_history', 'user_login_history_suspicious_login_idx')) {
                $table->index(['is_suspicious', 'login_at'], 'user_login_history_suspicious_login_idx');
            }
        });

        // Add composite indexes for audit_logs
        Schema::table('audit_logs', function (Blueprint $table) {
            if (! Schema::hasIndex('audit_logs', 'audit_logs_auditable_created_idx')) {
                $table->index(['auditable_type', 'auditable_id', 'created_at'], 'audit_logs_auditable_created_idx');
            }
            if (! Schema::hasIndex('audit_logs', 'audit_logs_user_created_idx')) {
                $table->index(['user_id', 'created_at'], 'audit_logs_user_created_idx');
            }
            if (! Schema::hasIndex('audit_logs', 'audit_logs_action_created_idx')) {
                $table->index(['action', 'created_at'], 'audit_logs_action_created_idx');
            }
        });

        // Add indexes for bank_accounts
        Schema::table('bank_accounts', function (Blueprint $table) {
            if (! Schema::hasIndex('bank_accounts', 'bank_accounts_user_status_default_idx')) {
                $table->index(['user_id', 'status', 'is_default'], 'bank_accounts_user_status_default_idx');
            }
            if (! Schema::hasIndex('bank_accounts', 'bank_accounts_company_status_idx')) {
                $table->index(['company_id', 'status'], 'bank_accounts_company_status_idx');
            }
            if (! Schema::hasIndex('bank_accounts', 'bank_accounts_category_status_idx')) {
                $table->index(['account_category', 'status'], 'bank_accounts_category_status_idx');
            }
        });

        // Add indexes for beneficiaries
        Schema::table('beneficiaries', function (Blueprint $table) {
            if (! Schema::hasIndex('beneficiaries', 'beneficiaries_user_created_idx')) {
                $table->index(['user_id', 'created_at'], 'beneficiaries_user_created_idx');
            }
            if (! Schema::hasIndex('beneficiaries', 'beneficiaries_category_created_idx')) {
                $table->index(['category', 'created_at'], 'beneficiaries_category_created_idx');
            }
        });

        // Add indexes for sessions
        Schema::table('sessions', function (Blueprint $table) {
            if (! Schema::hasIndex('sessions', 'sessions_user_activity_idx')) {
                $table->index(['user_id', 'last_activity'], 'sessions_user_activity_idx');
            }
            if (! Schema::hasIndex('sessions', 'sessions_current_user_idx')) {
                $table->index(['is_current', 'user_id'], 'sessions_current_user_idx');
            }
            if (! Schema::hasIndex('sessions', 'sessions_trusted_user_idx')) {
                $table->index(['trusted_device', 'user_id'], 'sessions_trusted_user_idx');
            }
        });

        // Add indexes for users table
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasIndex('users', 'users_role_active_created_idx')) {
                $table->index(['role', 'is_active', 'created_at'], 'users_role_active_created_idx');
            }
            if (! Schema::hasIndex('users', 'users_active_login_idx')) {
                $table->index(['is_active', 'last_login_at'], 'users_active_login_idx');
            }
            if (! Schema::hasIndex('users', 'users_locked_idx')) {
                $table->index(['locked_until'], 'users_locked_idx');
            }
            if (! Schema::hasIndex('users', 'users_email_verified_idx')) {
                $table->index(['email_verified_at'], 'users_email_verified_idx');
            }
            if (! Schema::hasIndex('users', 'users_phone_verified_idx')) {
                $table->index(['phone_verified_at'], 'users_phone_verified_idx');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->dropIndex('user_activity_logs_user_action_created_idx');
            $table->dropIndex('user_activity_logs_suspicious_created_idx');
            $table->dropIndex('user_activity_logs_action_created_idx');
        });

        Schema::table('user_login_history', function (Blueprint $table) {
            $table->dropIndex('user_login_history_user_login_successful_idx');
            $table->dropIndex('user_login_history_ip_success_login_idx');
            $table->dropIndex('user_login_history_suspicious_login_idx');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex('audit_logs_auditable_created_idx');
            $table->dropIndex('audit_logs_user_created_idx');
            $table->dropIndex('audit_logs_action_created_idx');
        });

        Schema::table('bank_accounts', function (Blueprint $table) {
            $table->dropIndex('bank_accounts_user_status_default_idx');
            $table->dropIndex('bank_accounts_company_status_idx');
            $table->dropIndex('bank_accounts_category_status_idx');
        });

        Schema::table('beneficiaries', function (Blueprint $table) {
            $table->dropIndex('beneficiaries_user_created_idx');
            $table->dropIndex('beneficiaries_category_created_idx');
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->dropIndex('sessions_user_activity_idx');
            $table->dropIndex('sessions_current_user_idx');
            $table->dropIndex('sessions_trusted_user_idx');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_active_created_idx');
            $table->dropIndex('users_active_login_idx');
            $table->dropIndex('users_locked_idx');
            $table->dropIndex('users_email_verified_idx');
            $table->dropIndex('users_phone_verified_idx');
        });
    }
};
