<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard inertia page', function () {
    $user = User::factory()->manager()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
    );
});

test('admins cannot visit the manager dashboard directly', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('employees cannot visit the manager dashboard directly', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});
