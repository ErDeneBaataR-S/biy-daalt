<?php

use App\Models\ManagerTask;
use App\Models\User;

test('manager can add a task from the manager workspace', function () {
    $manager = User::factory()->manager()->create();

    $this->actingAs($manager)
        ->post(route('manager.tasks.store'), [
            'title' => 'Prepare sprint handoff',
            'priority' => 'medium',
        ])
        ->assertRedirect();

    expect(ManagerTask::query()->where('manager_id', $manager->id)->first())
        ->not->toBeNull()
        ->title->toBe('Prepare sprint handoff');
});

test('manager created by an admin can add a task', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'Created Manager',
            'email' => 'created-manager@example.com',
            'password' => 'password',
            'role' => User::ROLE_MANAGER,
        ])
        ->assertRedirect(route('admin.users.index'));

    $manager = User::query()->where('email', 'created-manager@example.com')->firstOrFail();

    expect($manager->role)->toBe(User::ROLE_MANAGER)
        ->and($manager->email_verified_at)->not->toBeNull();

    $this->actingAs($manager)
        ->post(route('manager.tasks.store'), [
            'title' => 'Task from admin-created manager',
            'priority' => 'medium',
        ])
        ->assertRedirect();

    expect(ManagerTask::query()->where('manager_id', $manager->id)->first())
        ->not->toBeNull()
        ->title->toBe('Task from admin-created manager');
});

test('non managers cannot add manager tasks', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)
        ->post(route('manager.tasks.store'), [
            'title' => 'Prepare sprint handoff',
            'priority' => 'medium',
        ])
        ->assertForbidden();
})->with([
    User::ROLE_ADMIN,
    User::ROLE_EMPLOYEE,
]);
