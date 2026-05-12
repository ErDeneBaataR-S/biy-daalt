<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's user data.
     */
    public function run(): void
    {
        $manager = User::updateOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager',
                'password' => Hash::make('password'),
                'role' => User::ROLE_MANAGER,
                'manager_id' => null,
                'email_verified_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'manager_id' => null,
                'email_verified_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['email' => 'employee@example.com'],
            [
                'name' => 'Employee',
                'password' => Hash::make('password'),
                'role' => User::ROLE_EMPLOYEE,
                'manager_id' => $manager->id,
                'email_verified_at' => now(),
            ],
        );

        User::factory()
            ->manager()
            ->count(max(0, 2 - User::query()->where('role', User::ROLE_MANAGER)->count()))
            ->create();

        User::factory()
            ->employee()
            ->count(max(0, 5 - User::query()->where('role', User::ROLE_EMPLOYEE)->count()))
            ->create();
    }
}
