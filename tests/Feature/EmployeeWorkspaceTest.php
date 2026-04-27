<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('employee can visit my dashboard', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('my-dashboard'))
        ->assertInertia(fn (Assert $page) => $page->component('my-dashboard'));
});

test('manager is redirected away from employee-only pages', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->get(route('my-tasks'))
        ->assertForbidden();
});
