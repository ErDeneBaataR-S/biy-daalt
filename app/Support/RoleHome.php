<?php

namespace App\Support;

use App\Models\User;

class RoleHome
{
    public static function routeNameFor(User $user): string
    {
        return match ($user->role) {
            User::ROLE_ADMIN => 'dashboard',
            User::ROLE_MANAGER => 'dashboard',
            default => 'dashboard',
        };
    }

    /**
     * @return array<string, bool>
     */
    public static function capabilitiesFor(User $user): array
    {
        return [
            'access_admin' => $user->isAdmin(),
            'manage_projects' => $user->isAdmin() || $user->isManager(),
            'create_personal_tasks' => $user->isEmployee(),
            'view_company_updates' => true,
        ];
    }
}
