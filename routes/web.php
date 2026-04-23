<?php

use App\Support\RoleHome;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Fortify\Features;
use Inertia\Inertia;

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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('admin', 'dashboard')->name('admin.overview');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('my-dashboard', 'dashboard')->name('my-dashboard');
    Route::inertia('backlog', 'backlog')->name('backlog');
    Route::inertia('roadmap', 'roadmap')->name('roadmap');
    Route::inertia('feedback', 'Feedback')->name('feedback');
    Route::inertia('releases', 'Releases')->name('releases');
    Route::inertia('analytics', 'analytics')->name('analytics');
    Route::inertia('docs', 'Docs')->name('docs');
});

require __DIR__.'/settings.php';
