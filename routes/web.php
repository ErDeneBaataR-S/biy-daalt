<?php

use App\Http\Controllers\BacklogItemController;
use App\Http\Controllers\FeedbackItemController;
use App\Http\Controllers\ProductReleaseController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoadmapItemController;
use App\Support\RoleHome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    if ($request->user()) {
        return redirect()->route(RoleHome::routeNameFor($request->user()));
    }

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/home', function (Request $request) {
    return redirect()->route(RoleHome::routeNameFor($request->user()));
})->middleware(['auth', 'verified'])->name('app.home');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::inertia('admin', 'admin/overview')->name('admin.overview');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::patch('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::inertia('docs', 'Docs')->name('docs');
});

Route::middleware(['auth', 'verified', 'role:admin,manager'])->group(function () {
    Route::get('backlog', [BacklogItemController::class, 'index'])->name('backlog');
    Route::post('backlog', [BacklogItemController::class, 'store'])->name('backlog.store');
    Route::patch('backlog/{backlogItem}', [BacklogItemController::class, 'update'])->name('backlog.update');
    Route::delete('backlog/{backlogItem}', [BacklogItemController::class, 'destroy'])->name('backlog.destroy');
    Route::patch('backlog/{backlogItem}/move', [BacklogItemController::class, 'move'])->name('backlog.move');
    Route::get('roadmap', [RoadmapItemController::class, 'index'])->name('roadmap');
    Route::post('roadmap', [RoadmapItemController::class, 'store'])->name('roadmap.store');
    Route::patch('roadmap/{roadmapItem}', [RoadmapItemController::class, 'update'])->name('roadmap.update');
    Route::delete('roadmap/{roadmapItem}', [RoadmapItemController::class, 'destroy'])->name('roadmap.destroy');
    Route::patch('roadmap/{roadmapItem}/move', [RoadmapItemController::class, 'move'])->name('roadmap.move');
    Route::get('feedback', [FeedbackItemController::class, 'index'])->name('feedback');
    Route::post('feedback', [FeedbackItemController::class, 'store'])->name('feedback.store');
    Route::patch('feedback/{feedbackItem}', [FeedbackItemController::class, 'update'])->name('feedback.update');
    Route::delete('feedback/{feedbackItem}', [FeedbackItemController::class, 'destroy'])->name('feedback.destroy');
    Route::get('releases', [ProductReleaseController::class, 'index'])->name('releases');
    Route::post('releases', [ProductReleaseController::class, 'store'])->name('releases.store');
    Route::patch('releases/{productRelease}', [ProductReleaseController::class, 'update'])->name('releases.update');
    Route::delete('releases/{productRelease}', [ProductReleaseController::class, 'destroy'])->name('releases.destroy');
    Route::inertia('analytics', 'analytics')->name('analytics');
});

Route::middleware(['auth', 'verified', 'role:employee'])->group(function () {
    Route::inertia('my-dashboard', 'my-dashboard')->name('my-dashboard');
    Route::inertia('my-tasks', 'my-tasks')->name('my-tasks');
    Route::inertia('personal-tasks', 'personal-tasks')->name('personal-tasks');
    Route::inertia('updates', 'updates')->name('updates');
});

require __DIR__.'/settings.php';
