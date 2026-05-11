<?php

namespace App\Policies;

use App\Models\User;

class BacklogItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManage($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user);
    }

    public function update(User $user): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user): bool
    {
        return $this->canManage($user);
    }

    private function canManage(User $user): bool
    {
        return $user->isAdmin() || $user->isManager();
    }
}
