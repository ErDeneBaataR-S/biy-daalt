<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page from analytics', function () {
    $response = $this->get('/analytics');

    $response->assertRedirect(route('login'));
});

test('manager can visit the analytics inertia page', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user);

    $response = $this->get(route('analytics'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('analytics')
        ->where('auth.user.id', $user->id)
        ->where('auth.user.email', $user->email)
    );
});

test('employee is redirected away from analytics', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('analytics'))
        ->assertForbidden();
});
