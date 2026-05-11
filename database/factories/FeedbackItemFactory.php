<?php

namespace Database\Factories;

use App\Models\FeedbackItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<FeedbackItem> */
class FeedbackItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->sentence(),
            'status' => fake()->randomElement(['Open', 'In Progress', 'Closed']),
            'priority' => fake()->randomElement(['Low', 'Medium', 'High']),
            'deadline' => fake()->date(),
        ];
    }
}
