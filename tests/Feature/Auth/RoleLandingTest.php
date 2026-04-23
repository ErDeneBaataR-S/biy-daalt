<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Support\Facades\Schema;

test('user factory can create each supported role', function () {
    expect(User::factory()->admin()->make()->role)->toBe('admin');
    expect(User::factory()->manager()->make()->role)->toBe('manager');
    expect(User::factory()->employee()->make()->role)->toBe('employee');
});

test('user model accepts supported roles through assignment', function () {
    $user = new User([
        'name' => 'Manager User',
        'email' => 'manager@example.com',
        'password' => 'password',
        'role' => User::ROLE_MANAGER,
    ]);

    expect($user->role)->toBe(User::ROLE_MANAGER)
        ->and($user->isManager())->toBeTrue()
        ->and($user->isAdmin())->toBeFalse()
        ->and($user->isEmployee())->toBeFalse();
});

test('user model rejects invalid role assignment', function () {
    expect(fn () => new User([
        'name' => 'Invalid User',
        'email' => 'invalid@example.com',
        'password' => 'password',
        'role' => 'owner',
    ]))->toThrow(InvalidArgumentException::class);
});

test('transitional role migration rollback preserves role column', function () {
    $migration = require base_path('database/migrations/2026_04_23_000001_add_role_to_users_table.php');

    try {
        $migration->down();

        $roleColumnExistsAfterRollback = Schema::hasColumn('users', 'role');
    } finally {
        $migration->up();
    }

    expect($roleColumnExistsAfterRollback)->toBeTrue();
});

test('admin is redirected to the dashboard after hitting the landing route', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertRedirect(route('dashboard'));
});

test('employee inertia props include role and capability flags', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.role', User::ROLE_EMPLOYEE)
            ->where('auth.capabilities.access_admin', false)
            ->where('auth.capabilities.manage_projects', false)
            ->where('auth.capabilities.create_personal_tasks', true)
            ->where('auth.capabilities.view_company_updates', true)
        );
});
