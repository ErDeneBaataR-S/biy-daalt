<?php

namespace Database\Factories;

use App\Models\RoadmapItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<RoadmapItem> */
class RoadmapItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'status' => fake()->randomElement(['now', 'next', 'later']),
            'position' => fake()->numberBetween(1, 20),
        ];
    }
}
