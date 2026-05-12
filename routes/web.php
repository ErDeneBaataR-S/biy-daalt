<?php

use App\Http\Controllers\Admin\AccessController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\BacklogItemController;
use App\Http\Controllers\EmployeeDashboardController;
use App\Http\Controllers\EmployeeTaskController;
use App\Http\Controllers\FeedbackItemController;
use App\Http\Controllers\ManagerTaskController;
use App\Http\Controllers\ManagerWorkspaceController;
use App\Http\Controllers\ProductReleaseController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoadmapItemController;
use App\Http\Controllers\WorkspaceUpdateController;
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

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::inertia('', 'admin/overview')->name('overview');
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
    Route::patch('users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role.update');
    Route::patch('users/{user}/manager', [AdminUserController::class, 'updateManager'])->name('users.manager.update');
    Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::get('access', AccessController::class)->name('access');
});

Route::middleware(['auth', 'verified', 'role:manager'])->group(function () {
    Route::get('dashboard', ManagerWorkspaceController::class)->name('dashboard');
    Route::post('manager/tasks', [ManagerTaskController::class, 'store'])->name('manager.tasks.store');
    Route::patch('manager/tasks/{managerTask}/assign', [ManagerTaskController::class, 'assign'])->name('manager.tasks.assign');
    Route::delete('manager/tasks/{managerTask}', [ManagerTaskController::class, 'destroy'])->name('manager.tasks.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::patch('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::inertia('docs', 'Docs')->name('docs');
});

Route::middleware(['auth', 'verified', 'role:admin,manager,employee'])->group(function () {
    Route::get('feedback', [FeedbackItemController::class, 'index'])->name('feedback');
    Route::post('feedback', [FeedbackItemController::class, 'store'])->name('feedback.store');
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
    Route::patch('feedback/{feedbackItem}', [FeedbackItemController::class, 'update'])->name('feedback.update');
    Route::patch('feedback/{feedbackItem}/approve', [FeedbackItemController::class, 'approve'])->name('feedback.approve');
    Route::delete('feedback/{feedbackItem}', [FeedbackItemController::class, 'destroy'])->name('feedback.destroy');
    Route::get('releases', [ProductReleaseController::class, 'index'])->name('releases');
    Route::post('releases', [ProductReleaseController::class, 'store'])->name('releases.store');
    Route::patch('releases/{productRelease}', [ProductReleaseController::class, 'update'])->name('releases.update');
    Route::delete('releases/{productRelease}', [ProductReleaseController::class, 'destroy'])->name('releases.destroy');
    Route::inertia('analytics', 'analytics')->name('analytics');
});

Route::middleware(['auth', 'verified', 'role:admin,manager,employee'])->group(function () {
    Route::get('updates', [WorkspaceUpdateController::class, 'index'])->name('updates');
});

Route::middleware(['auth', 'verified', 'role:manager'])->group(function () {
    Route::post('updates', [WorkspaceUpdateController::class, 'store'])->name('updates.store');
    Route::patch('updates/{workspaceUpdate}', [WorkspaceUpdateController::class, 'update'])->name('updates.update');
    Route::delete('updates/{workspaceUpdate}', [WorkspaceUpdateController::class, 'destroy'])->name('updates.destroy');
});

Route::middleware(['auth', 'verified', 'role:employee'])->group(function () {
    Route::get('my-dashboard', EmployeeDashboardController::class)->name('my-dashboard');
    Route::get('my-tasks', [EmployeeTaskController::class, 'assigned'])->name('my-tasks');
    Route::post('my-tasks', [EmployeeTaskController::class, 'store'])->defaults('type', 'assigned')->name('my-tasks.store');
    Route::patch('my-tasks/{employeeTask}', [EmployeeTaskController::class, 'update'])->name('my-tasks.update');
    Route::delete('my-tasks/{employeeTask}', [EmployeeTaskController::class, 'destroy'])->name('my-tasks.destroy');
    Route::get('personal-tasks', [EmployeeTaskController::class, 'personal'])->name('personal-tasks');
    Route::post('personal-tasks', [EmployeeTaskController::class, 'store'])->defaults('type', 'personal')->name('personal-tasks.store');
    Route::patch('personal-tasks/{employeeTask}', [EmployeeTaskController::class, 'update'])->name('personal-tasks.update');
    Route::delete('personal-tasks/{employeeTask}', [EmployeeTaskController::class, 'destroy'])->name('personal-tasks.destroy');
});

require __DIR__.'/settings.php';
