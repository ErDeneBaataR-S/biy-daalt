<?php

namespace App\Models;

use Database\Factories\FeedbackItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackItem extends Model
{
    /** @use HasFactory<FeedbackItemFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'deadline',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
        ];
    }
}
