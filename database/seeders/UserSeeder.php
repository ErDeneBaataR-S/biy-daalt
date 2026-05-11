<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's user data.
     */
    public function run(): void
    {
        User::factory()
            ->admin()
            ->create([
                'name' => 'Administrator',
                'email' => 'admin@example.com',
            ]);

        User::factory()
            ->manager()
            ->count(2)
            ->create();

        User::factory()
            ->employee()
            ->count(5)
            ->create();
    }
}
