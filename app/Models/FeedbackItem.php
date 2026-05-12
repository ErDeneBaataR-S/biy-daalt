<?php

namespace App\Models;

use Database\Factories\FeedbackItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeedbackItem extends Model
{
    /** @use HasFactory<FeedbackItemFactory> */
    use HasFactory;

    protected $fillable = [
        'submitted_by_id',
        'reviewed_by_id',
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
            'approved_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by_id');
    }

    /** @return BelongsTo<User, $this> */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_id');
    }
}
