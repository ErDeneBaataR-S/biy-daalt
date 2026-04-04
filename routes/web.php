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
});

require __DIR__.'/settings.php';
