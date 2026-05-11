<?php

namespace App\Models;

use Database\Factories\RoadmapItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoadmapItem extends Model
{
    /** @use HasFactory<RoadmapItemFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'status',
        'position',
    ];
}
