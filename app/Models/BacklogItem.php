<?php

namespace App\Models;

use Database\Factories\BacklogItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BacklogItem extends Model
{
    /** @use HasFactory<BacklogItemFactory> */
    use HasFactory;

    protected $fillable = [
        'kind',
        'title',
        'status',
        'priority',
        'owner',
        'team',
        'sprint_label',
        'estimate_label',
        'position',
    ];
}
