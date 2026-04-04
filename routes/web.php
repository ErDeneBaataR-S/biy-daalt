<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\RoadmapController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('backlog', 'backlog')->name('backlog');
    Route::get('/roadmap', [RoadmapController::class, 'index'])->name('roadmap');
    Route::post('/roadmap', [RoadmapController::class, 'store']);
    Route::put('/roadmap/{roadmap}', [RoadmapController::class, 'update']);
    Route::delete('/roadmap/{roadmap}', [RoadmapController::class, 'destroy']);
});

require __DIR__.'/settings.php';