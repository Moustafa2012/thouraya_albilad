<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Create Super Admin User
        $superAdminId = DB::table('users')->insertGetId([
            'username' => 'malmoustafa',
            'name' => 'Muhammad Al Moustafa',
            'email' => 'Malmoustafa1@outlook.sa',
            'phone' => '+966533645483',
            'avatar' => 'https://avatars.githubusercontent.com/u/124599?v=4',
            'date_of_birth' => '1998-03-12',
            'gender' => 'male',
            'nationality' => 'Saudi Arabia',
            'timezone' => 'Asia/Riyadh',
            'locale' => 'ar',
            'bio' => 'System Super Administrator with full access',
            'address' => 'Jeddah, Saudi Arabia',
            'city' => 'Jeddah',
            'state' => 'Makkah Governorate',
            'country' => 'Saudi Arabia',
            'postal_code' => '11564',

            'password' => Hash::make('Optimum2026@'),
            'two_factor_enabled' => false,
            'remember_token' => Str::random(10),

            'email_verified_at' => $now,
            'phone_verified_at' => $now,

            'login_attempts' => 0,
            'password_changed_at' => $now,
            'force_password_change' => false,
            'last_login_at' => $now,
            'last_login_ip' => '127.0.0.1',
            'last_login_user_agent' => 'Seeder',
            'last_login_device' => 'Web Browser',

            'role' => 'super_admin',
            'permissions' => json_encode([
                'users' => ['create', 'read', 'update', 'delete'],
                'roles' => ['create', 'read', 'update', 'delete'],
                'permissions' => ['create', 'read', 'update', 'delete'],
                'settings' => ['read', 'update'],
                'logs' => ['read', 'delete'],
                'companies' => ['create', 'read', 'update', 'delete'],
                'departments' => ['create', 'read', 'update', 'delete'],
                'all' => ['*'],
            ]),
            'settings' => json_encode([
                'theme' => 'light',
                'language' => 'en',
                'items_per_page' => 25,
            ]),
            'is_active' => true,
            'is_verified' => true,
            'is_banned' => false,
            'is_super_admin' => true,

            'company_id' => null,
            'department_id' => null,
            'manager_id' => null,
            'employee_id' => 'EMP-0001',
            'job_title' => 'System Administrator',
            'employment_type' => 'full-time',
            'employment_status' => 'active',
            'hired_at' => $now,

            'email_notifications_enabled' => true,
            'sms_notifications_enabled' => true,
            'push_notifications_enabled' => true,
            'notification_preferences' => json_encode([
                'email' => ['security_alerts', 'system_updates', 'user_activities'],
                'sms' => ['security_alerts'],
                'push' => ['security_alerts', 'system_updates'],
            ]),
            'preferred_contact_method' => 'email',

            'profile_public' => false,
            'show_email' => false,
            'show_phone' => false,
            'allow_messages' => true,

            'created_by' => null,
            'created_ip' => '127.0.0.1',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Create Admin User
        $adminId = DB::table('users')->insertGetId([
            'username' => 'admin',
            'name' => 'System Administrator',
            'email' => 'admin@example.com',
            'phone' => '+966500000001',
            'avatar' => null,
            'date_of_birth' => '1992-05-15',
            'gender' => 'male',
            'nationality' => 'Saudi Arabia',
            'timezone' => 'Asia/Riyadh',
            'locale' => 'en',
            'bio' => 'System Administrator',
            'city' => 'Jeddah',
            'country' => 'Saudi Arabia',

            'password' => Hash::make('Admin@123'),
            'two_factor_enabled' => false,
            'remember_token' => Str::random(10),

            'email_verified_at' => $now,
            'phone_verified_at' => $now,

            'login_attempts' => 0,
            'password_changed_at' => $now,
            'last_login_at' => $now,
            'last_login_ip' => '127.0.0.1',

            'role' => 'admin',
            'permissions' => json_encode([
                'users' => ['create', 'read', 'update', 'delete'],
                'roles' => ['read'],
                'companies' => ['create', 'read', 'update'],
                'departments' => ['create', 'read', 'update', 'delete'],
                'logs' => ['read'],
            ]),
            'is_active' => true,
            'is_verified' => true,
            'is_banned' => false,
            'is_super_admin' => false,

            'employee_id' => 'EMP-0002',
            'job_title' => 'Administrator',
            'employment_type' => 'full-time',
            'employment_status' => 'active',
            'hired_at' => $now,

            'email_notifications_enabled' => true,
            'sms_notifications_enabled' => true,
            'push_notifications_enabled' => true,
            'preferred_contact_method' => 'email',

            'profile_public' => false,
            'allow_messages' => true,

            'created_by' => $superAdminId,
            'created_ip' => '127.0.0.1',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Create Manager User
        $managerId = DB::table('users')->insertGetId([
            'username' => 'manager',
            'name' => 'Department Manager',
            'email' => 'manager@example.com',
            'phone' => '+966500000002',
            'date_of_birth' => '1988-08-20',
            'gender' => 'female',
            'nationality' => 'Saudi Arabia',
            'timezone' => 'Asia/Riyadh',
            'locale' => 'en',
            'city' => 'Riyadh',
            'country' => 'Saudi Arabia',

            'password' => Hash::make('Manager@123'),
            'remember_token' => Str::random(10),

            'email_verified_at' => $now,
            'phone_verified_at' => $now,

            'password_changed_at' => $now,

            'role' => 'manager',
            'permissions' => json_encode([
                'users' => ['create', 'read', 'update'],
                'departments' => ['read', 'update'],
                'reports' => ['read', 'create'],
            ]),
            'is_active' => true,
            'is_verified' => true,
            'is_super_admin' => false,

            'employee_id' => 'EMP-0003',
            'job_title' => 'Department Manager',
            'employment_type' => 'full-time',
            'employment_status' => 'active',
            'hired_at' => $now,

            'email_notifications_enabled' => true,
            'preferred_contact_method' => 'email',
            'profile_public' => false,
            'allow_messages' => true,

            'created_by' => $superAdminId,
            'created_ip' => '127.0.0.1',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Create Regular User
        DB::table('users')->insert([
            'username' => 'user',
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'phone' => '+966500000003',
            'date_of_birth' => '1995-03-10',
            'gender' => 'male',
            'nationality' => 'Saudi Arabia',
            'timezone' => 'Asia/Riyadh',
            'locale' => 'en',
            'city' => 'Dammam',
            'country' => 'Saudi Arabia',

            'password' => Hash::make('User@123'),
            'remember_token' => Str::random(10),

            'email_verified_at' => $now,
            'phone_verified_at' => $now,

            'password_changed_at' => $now,

            'role' => 'user',
            'permissions' => json_encode([
                'profile' => ['read', 'update'],
                'posts' => ['create', 'read', 'update', 'delete'],
            ]),
            'is_active' => true,
            'is_verified' => true,
            'is_super_admin' => false,

            'employee_id' => 'EMP-0004',
            'job_title' => 'Employee',
            'employment_type' => 'full-time',
            'employment_status' => 'active',
            'hired_at' => $now,
            'manager_id' => $managerId,

            'email_notifications_enabled' => true,
            'preferred_contact_method' => 'email',
            'profile_public' => true,
            'allow_messages' => true,

            'created_by' => $adminId,
            'created_ip' => '127.0.0.1',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Log super admin creation
        DB::table('user_activity_logs')->insert([
            'user_id' => $superAdminId,
            'action' => 'account_created',
            'entity_type' => 'User',
            'entity_id' => $superAdminId,
            'description' => 'Super Admin account created via seeder',
            'metadata' => json_encode([
                'role' => 'super_admin',
                'is_super_admin' => true,
                'created_via' => 'seeder',
            ]),
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Database Seeder',
            'severity' => 'info',
            'created_at' => $now,
        ]);

        // Log admin creation
        DB::table('user_activity_logs')->insert([
            'user_id' => $adminId,
            'action' => 'account_created',
            'entity_type' => 'User',
            'entity_id' => $adminId,
            'description' => 'Admin account created by Super Admin',
            'metadata' => json_encode([
                'role' => 'admin',
                'created_by' => 'super_admin',
                'created_via' => 'seeder',
            ]),
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Database Seeder',
            'severity' => 'info',
            'created_at' => $now,
        ]);

        // Create user preferences for super admin
        $preferences = [
            ['key' => 'theme', 'value' => 'dark', 'type' => 'string', 'category' => 'display'],
            ['key' => 'items_per_page', 'value' => '25', 'type' => 'integer', 'category' => 'display'],
            ['key' => 'email_notifications', 'value' => 'true', 'type' => 'boolean', 'category' => 'notification'],
            ['key' => 'two_factor_enabled', 'value' => 'false', 'type' => 'boolean', 'category' => 'security'],
            ['key' => 'session_timeout', 'value' => '3600', 'type' => 'integer', 'category' => 'security'],
        ];

        foreach ($preferences as $preference) {
            DB::table('user_preferences')->insert([
                'user_id' => $superAdminId,
                'key' => $preference['key'],
                'value' => $preference['value'],
                'type' => $preference['type'],
                'category' => $preference['category'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command->info('✅ Super Admin created successfully!');
        $this->command->info('📧 Email: superadmin@example.com');
        $this->command->info('🔑 Password: SuperAdmin@123');
        $this->command->newLine();
        $this->command->info('✅ Admin created successfully!');
        $this->command->info('📧 Email: admin@example.com');
        $this->command->info('🔑 Password: Admin@123');
        $this->command->newLine();
        $this->command->info('✅ Manager created successfully!');
        $this->command->info('📧 Email: manager@example.com');
        $this->command->info('🔑 Password: Manager@123');
        $this->command->newLine();
        $this->command->info('✅ Regular User created successfully!');
        $this->command->info('📧 Email: user@example.com');
        $this->command->info('🔑 Password: User@123');
        $this->command->newLine();
        $this->command->warn('⚠️  Please change these passwords after first login!');
    }
}
