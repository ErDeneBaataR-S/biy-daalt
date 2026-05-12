<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('non admins cannot access admin users page', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)
        ->get(route('admin.users.index'))
        ->assertForbidden();
})->with([User::ROLE_MANAGER, User::ROLE_EMPLOYEE]);

test('admin can access admin users page', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->manager()->create(['name' => 'Manager User']);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users')
            ->has('users', 2)
            ->where('roles', User::roles())
        );
});

test('admin can create a user with a role', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'New Manager',
            'email' => 'new-manager@example.com',
            'password' => 'password',
            'role' => User::ROLE_MANAGER,
        ])
        ->assertRedirect(route('admin.users.index'));

    $user = User::where('email', 'new-manager@example.com')->firstOrFail();

    expect($user->name)->toBe('New Manager')
        ->and($user->role)->toBe(User::ROLE_MANAGER)
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(Hash::check('password', $user->password))->toBeTrue();
});

test('admin user creation rejects duplicate email and invalid role', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($admin)
        ->from(route('admin.users.index'))
        ->post(route('admin.users.store'), [
            'name' => 'Bad User',
            'email' => 'taken@example.com',
            'password' => 'password',
            'role' => 'owner',
        ])
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHasErrors(['email', 'role']);
});

test('admin can update another users role', function () {
    $admin = User::factory()->admin()->create();
    $employee = User::factory()->employee()->create();

    $this->actingAs($admin)
        ->patch(route('admin.users.role.update', $employee), ['role' => User::ROLE_MANAGER])
        ->assertRedirect(route('admin.users.index'));

    expect($employee->fresh()->role)->toBe(User::ROLE_MANAGER);
});

test('admin cannot demote themselves', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch(route('admin.users.role.update', $admin), ['role' => User::ROLE_EMPLOYEE])
        ->assertForbidden();

    expect($admin->fresh()->role)->toBe(User::ROLE_ADMIN);
});

test('admin cannot remove the last admin role', function () {
    $admin = User::factory()->admin()->create();
    $otherAdmin = User::factory()->admin()->create();

    $otherAdmin->delete();

    $this->actingAs($admin)
        ->patch(route('admin.users.role.update', $admin), ['role' => User::ROLE_MANAGER])
        ->assertForbidden();

    expect($admin->fresh()->role)->toBe(User::ROLE_ADMIN);
});

test('admin can delete another user but cannot delete themselves or the last admin', function () {
    $admin = User::factory()->admin()->create();
    $otherAdmin = User::factory()->admin()->create();
    $employee = User::factory()->employee()->create();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $employee))
        ->assertRedirect(route('admin.users.index'));

    expect(User::whereKey($employee->id)->exists())->toBeFalse();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertForbidden();

    $otherAdmin->delete();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertForbidden();
});
