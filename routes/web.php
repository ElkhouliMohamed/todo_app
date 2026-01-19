<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Task routes
    Route::get('tasks/calendar', [\App\Http\Controllers\TaskController::class, 'calendar'])->name('tasks.calendar');
    // Notifications
    Route::get('notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    Route::resource('tasks', \App\Http\Controllers\TaskController::class);
    Route::post('tasks/{task}/complete', [\App\Http\Controllers\TaskController::class, 'complete'])->name('tasks.complete');
    Route::post('tasks/{id}/restore', [\App\Http\Controllers\TaskController::class, 'restore'])->name('tasks.restore');
    Route::post('tasks/reorder', [\App\Http\Controllers\TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::post('tasks/bulk-destroy', [\App\Http\Controllers\TaskController::class, 'bulkDestroy'])->name('tasks.bulk-destroy');

    // Recurring Tasks
    Route::resource('recurring-tasks', \App\Http\Controllers\RecurringTaskController::class);
    Route::post('recurring-tasks/{recurringTask}/toggle-active', [\App\Http\Controllers\RecurringTaskController::class, 'toggleActive'])->name('recurring-tasks.toggle-active');

    // Logs
    Route::get('logs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index'])->middleware(['role:admin'])->name('logs');
});

require __DIR__ . '/auth.php';
