<?php

use App\Models\User;

test('user factory can create each supported role', function () {
    expect(User::factory()->admin()->make()->role)->toBe('admin');
    expect(User::factory()->manager()->make()->role)->toBe('manager');
    expect(User::factory()->employee()->make()->role)->toBe('employee');
});
