export type UserRole = 'admin' | 'manager' | 'employee';

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type AuthCapabilities = {
    access_admin: boolean;
    manage_projects: boolean;
    create_personal_tasks: boolean;
    view_company_updates: boolean;
};

export type Auth = {
    user: User;
    capabilities: AuthCapabilities;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
