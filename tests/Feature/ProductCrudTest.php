<?php

use App\Models\BacklogItem;
use App\Models\FeedbackItem;
use App\Models\ProductRelease;
use App\Models\Project;
use App\Models\RoadmapItem;
use App\Models\User;

test('manager can create update and delete a project', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->post(route('projects.store'), [
            'name' => 'Customer portal',
            'description' => 'Shared customer workspace',
            'status' => 'active',
            'owner' => 'Growth',
        ])
        ->assertRedirect(route('projects.index'));

    $project = Project::where('name', 'Customer portal')->firstOrFail();

    $this->actingAs($user)
        ->patch(route('projects.update', $project), ['name' => 'Customer portal v2'])
        ->assertRedirect(route('projects.index'));

    expect($project->fresh()->name)->toBe('Customer portal v2');

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project))
        ->assertRedirect(route('projects.index'));

    expect(Project::whereKey($project->id)->exists())->toBeFalse();
});

test('manager can create update and delete backlog item', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->post(route('backlog.store'), [
            'kind' => 'feature',
            'title' => 'Persist backlog',
            'status' => 'planned',
            'priority' => 'high',
            'owner' => 'Product',
            'team' => 'Core',
            'sprint_label' => 'Sprint 12',
            'estimate_label' => '5 pts',
        ])
        ->assertRedirect(route('backlog'));

    $item = BacklogItem::where('title', 'Persist backlog')->firstOrFail();

    $this->actingAs($user)
        ->patch(route('backlog.update', $item), ['title' => 'Persist backlog records'])
        ->assertRedirect(route('backlog'));

    expect($item->fresh()->title)->toBe('Persist backlog records');

    $this->actingAs($user)
        ->delete(route('backlog.destroy', $item))
        ->assertRedirect(route('backlog'));

    expect(BacklogItem::whereKey($item->id)->exists())->toBeFalse();
});

test('manager can create update and delete roadmap item', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->post(route('roadmap.store'), ['title' => 'Ship roadmap', 'status' => 'now'])
        ->assertRedirect(route('roadmap'));

    $item = RoadmapItem::where('title', 'Ship roadmap')->firstOrFail();

    $this->actingAs($user)
        ->patch(route('roadmap.update', $item), ['status' => 'next'])
        ->assertRedirect(route('roadmap'));

    expect($item->fresh()->status)->toBe('next');

    $this->actingAs($user)
        ->delete(route('roadmap.destroy', $item))
        ->assertRedirect(route('roadmap'));

    expect(RoadmapItem::whereKey($item->id)->exists())->toBeFalse();
});

test('manager can create update and delete feedback item', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->post(route('feedback.store'), [
            'title' => 'Improve search',
            'description' => 'Customers need faster filtering',
            'status' => 'Open',
            'priority' => 'High',
            'deadline' => '2026-06-01',
        ])
        ->assertRedirect(route('feedback'));

    $item = FeedbackItem::where('title', 'Improve search')->firstOrFail();

    $this->actingAs($user)
        ->patch(route('feedback.update', $item), ['status' => 'Closed'])
        ->assertRedirect(route('feedback'));

    expect($item->fresh()->status)->toBe('Closed');

    $this->actingAs($user)
        ->delete(route('feedback.destroy', $item))
        ->assertRedirect(route('feedback'));

    expect(FeedbackItem::whereKey($item->id)->exists())->toBeFalse();
});

test('manager can create update and delete release', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->post(route('releases.store'), [
            'version' => 'v2.0',
            'release_date' => '2026-06-15',
            'features' => ['Persistent releases'],
        ])
        ->assertRedirect(route('releases'));

    $release = ProductRelease::where('version', 'v2.0')->firstOrFail();

    $this->actingAs($user)
        ->patch(route('releases.update', $release), ['features' => ['Persistent releases', 'Audit ready']])
        ->assertRedirect(route('releases'));

    expect($release->fresh()->features)->toBe(['Persistent releases', 'Audit ready']);

    $this->actingAs($user)
        ->delete(route('releases.destroy', $release))
        ->assertRedirect(route('releases'));

    expect(ProductRelease::whereKey($release->id)->exists())->toBeFalse();
});

test('backlog items can be moved to a new persisted position', function () {
    $user = User::factory()->manager()->create();
    $first = BacklogItem::factory()->create(['position' => 1]);
    $second = BacklogItem::factory()->create(['position' => 2]);

    $this->actingAs($user)
        ->patch(route('backlog.move', $first), ['position' => 2])
        ->assertRedirect(route('backlog'));

    expect($first->fresh()->position)->toBe(2)
        ->and($second->fresh()->position)->toBe(1);
});

test('roadmap items can be moved to a new persisted status and position', function () {
    $user = User::factory()->manager()->create();
    $item = RoadmapItem::factory()->create(['status' => 'now', 'position' => 1]);

    $this->actingAs($user)
        ->patch(route('roadmap.move', $item), ['status' => 'next', 'position' => 1])
        ->assertRedirect(route('roadmap'));

    expect($item->fresh()->status)->toBe('next')
        ->and($item->fresh()->position)->toBe(1);
});
