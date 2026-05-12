<?php

use App\Models\User;
use Database\Seeders\UserSeeder;

test('demo manager account is seeded as a verified manager', function () {
    $this->seed(UserSeeder::class);

    $manager = User::query()->where('email', 'manager@example.com')->firstOrFail();

    expect($manager->role)->toBe(User::ROLE_MANAGER)
        ->and($manager->email_verified_at)->not->toBeNull();
});
