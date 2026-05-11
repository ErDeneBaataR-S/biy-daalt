<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('roadmap'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the roadmap inertia page', function () {
    $user = User::factory()->manager()->create();

    $this->withoutVite();
    $this->actingAs($user);

    $response = $this->get(route('roadmap'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('roadmap')
        ->where('auth.user.id', $user->id)
        ->has('items')
    );
});
