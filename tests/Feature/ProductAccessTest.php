<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from product pages', function (string $route) {
    $this->get(route($route))->assertRedirect(route('login'));
})->with([
    'projects.index',
    'backlog',
    'roadmap',
    'feedback',
    'releases',
]);

test('employee cannot access backlog management', function () {
    $this->actingAs(User::factory()->employee()->create())
        ->get(route('backlog'))
        ->assertForbidden();
});

test('manager can access product workflow pages', function (string $route) {
    $response = $this->actingAs(User::factory()->manager()->create())
        ->get(route($route));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->has(match ($route) {
        'projects.index' => 'projects',
        default => 'items',
    }));
})->with([
    'projects.index',
    'backlog',
    'roadmap',
    'feedback',
    'releases',
]);
