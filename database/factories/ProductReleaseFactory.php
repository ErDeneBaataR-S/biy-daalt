<?php

namespace Database\Factories;

use App\Models\ProductRelease;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ProductRelease> */
class ProductReleaseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'version' => 'v'.fake()->numberBetween(1, 5).'.'.fake()->numberBetween(0, 9),
            'release_date' => fake()->date(),
            'features' => [fake()->sentence(3), fake()->sentence(3)],
        ];
    }
}
