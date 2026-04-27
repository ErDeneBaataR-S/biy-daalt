<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('manager cannot access admin overview', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->get(route('admin.overview'))
        ->assertForbidden();
});

test('admin can access admin overview', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('admin.overview'))
        ->assertOk();
});

test('admin overview renders the admin overview component', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('admin.overview'))
        ->assertInertia(fn (Assert $page) => $page->component('admin/overview'));
});

test('manager can visit projects page', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->get(route('projects.index'))
        ->assertInertia(fn (Assert $page) => $page->component('projects'));
});
