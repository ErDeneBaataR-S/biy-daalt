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

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::inertia('admin', 'admin/overview')->name('admin.overview');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('projects', 'projects')->name('projects.index');
    Route::inertia('roadmap', 'roadmap')->name('roadmap');
    Route::inertia('feedback', 'Feedback')->name('feedback');
    Route::inertia('releases', 'Releases')->name('releases');
    Route::inertia('docs', 'Docs')->name('docs');
});

Route::middleware(['auth', 'verified', 'role:admin,manager'])->group(function () {
    Route::inertia('backlog', 'backlog')->name('backlog');
    Route::inertia('analytics', 'analytics')->name('analytics');
});

Route::middleware(['auth', 'verified', 'role:employee'])->group(function () {
    Route::inertia('my-dashboard', 'my-dashboard')->name('my-dashboard');
    Route::inertia('my-tasks', 'my-tasks')->name('my-tasks');
    Route::inertia('personal-tasks', 'personal-tasks')->name('personal-tasks');
    Route::inertia('updates', 'updates')->name('updates');
});

require __DIR__.'/settings.php';
