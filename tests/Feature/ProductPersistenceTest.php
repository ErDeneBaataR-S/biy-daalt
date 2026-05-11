<?php

use App\Models\BacklogItem;
use App\Models\FeedbackItem;
use App\Models\ProductRelease;
use App\Models\Project;
use App\Models\RoadmapItem;

test('product models can persist their core fields', function () {
    $project = Project::factory()->create(['name' => 'Website refresh']);
    $backlog = BacklogItem::factory()->create(['title' => 'Auth polish', 'position' => 1]);
    $roadmap = RoadmapItem::factory()->create(['title' => 'Public roadmap', 'status' => 'next', 'position' => 1]);
    $feedback = FeedbackItem::factory()->create(['title' => 'Dark mode', 'priority' => 'high']);
    $release = ProductRelease::factory()->create(['version' => 'v1.2.0']);

    expect($project->fresh()->name)->toBe('Website refresh')
        ->and($backlog->fresh()->title)->toBe('Auth polish')
        ->and($roadmap->fresh()->status)->toBe('next')
        ->and($feedback->fresh()->priority)->toBe('high')
        ->and($release->fresh()->version)->toBe('v1.2.0');
});
