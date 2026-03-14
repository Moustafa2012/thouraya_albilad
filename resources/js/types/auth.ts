export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    can?: string[];
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    phone?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female';
    nationality?: string;
    timezone?: string;
    locale?: string;
    permissions?: string[];
    is_active?: boolean;
    is_super_admin?: boolean;
    last_login_at?: string;
    last_login_ip?: string;
    company_id?: number;
    department_id?: number;
    job_title?: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
