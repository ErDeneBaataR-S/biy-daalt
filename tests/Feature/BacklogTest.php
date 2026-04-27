<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('backlog'));
    $response->assertRedirect(route('login'));
});

test('manager can visit the backlog inertia page', function () {
    $user = User::factory()->manager()->create();
    $this->actingAs($user);

    $response = $this->get(route('backlog'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('backlog')
        ->where('auth.user.id', $user->id)
    );
});

test('employee cannot use manager backlog route as a primary workspace', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('backlog'))
        ->assertForbidden();
});
