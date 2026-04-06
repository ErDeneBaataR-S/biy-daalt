<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('backlog', 'backlog')->name('backlog');
    Route::inertia('roadmap', 'roadmap')->name('roadmap');
    Route::inertia('feedback', 'Feedback')->name('feedback');
    Route::inertia('releases', 'Releases')->name('releases');
    Route::inertia('analytics', 'analytics')->name('analytics');
    Route::inertia('docs', 'Docs')->name('docs');
});

require __DIR__.'/settings.php';
