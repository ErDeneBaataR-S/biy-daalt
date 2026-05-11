<?php

namespace Database\Factories;

use App\Models\BacklogItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<BacklogItem> */
class BacklogItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'kind' => fake()->randomElement(['feature', 'bug', 'design', 'research']),
            'title' => fake()->sentence(3),
            'status' => fake()->randomElement(['planned', 'in-review', 'blocked', 'done']),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
            'owner' => fake()->name(),
            'team' => fake()->randomElement(['Core', 'Growth', 'Lifecycle']),
            'sprint_label' => 'Sprint '.fake()->numberBetween(1, 20),
            'estimate_label' => fake()->numberBetween(1, 8).' pts',
            'position' => fake()->numberBetween(1, 20),
        ];
    }
}
