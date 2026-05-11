<?php

namespace App\Models;

use Database\Factories\ProductReleaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductRelease extends Model
{
    /** @use HasFactory<ProductReleaseFactory> */
    use HasFactory;

    protected $fillable = [
        'version',
        'release_date',
        'features',
    ];

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
            'features' => 'array',
        ];
    }
}
