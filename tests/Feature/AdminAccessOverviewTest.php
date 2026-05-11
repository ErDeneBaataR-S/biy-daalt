<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('only admins can access role access overview', function () {
    $manager = User::factory()->manager()->create();

    $this->actingAs($manager)
        ->get(route('admin.access'))
        ->assertForbidden();
});

test('admin can view role access overview', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.access'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/access')
            ->has('roles', 3)
        );
});
