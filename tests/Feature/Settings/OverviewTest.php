<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page from settings overview', function () {
    $response = $this->get('/settings');

    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the settings overview inertia page', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get(route('settings.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('settings/index')
        ->where('auth.user.id', $user->id)
        ->where('auth.user.email', $user->email)
    );
});
