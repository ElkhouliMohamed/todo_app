<?php

use App\Models\User;
use App\Models\RecurringTask;
use App\Services\RecurringTaskService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate specific setup
$user = User::first();
if (!$user) {
    $user = User::factory()->create();
}
Auth::login($user);

echo "Starting Debug Script...\n";

try {
    // Cleaning up previous test data
    RecurringTask::where('title', 'Debug Monthly Task')->forceDelete();

    // Create a mock Recurring Task (Monthly Day 1)
    $startDate = Carbon::parse('2026-02-01');
    $recurringTask = RecurringTask::create([
        'user_id' => $user->id,
        'title' => 'Debug Monthly Task Day 1',
        'description' => 'Debugging generation',
        'recurrence_type' => 'monthly',
        'recurrence_interval' => 1,
        'recurrence_days' => [],
        'recurrence_day_of_month' => 1,
        'start_date' => $startDate,
        'is_active' => true,
        'occurrences_created' => 0,
        'priority' => 'medium',
        'is_all_day' => true,
    ]);

    echo "Created Recurring Task ID: {$recurringTask->id}\n";
    echo "Start Date: " . $startDate->toDateTimeString() . "\n";
    echo "Recurrence Type: monthly\n";
    echo "Day of Month: 1\n";

    $service = new RecurringTaskService();

    // We want to generate for 2 years
    $daysAhead = 730;
    echo "Generating tasks for {$daysAhead} days ahead...\n";

    $count = $service->generateTasksForRecurringTask($recurringTask, $daysAhead);

    echo "Tasks Created: {$count}\n";

    $tasks = \App\Models\Task::where('recurring_task_id', $recurringTask->id)->orderBy('due_date')->get();
    foreach ($tasks as $task) {
        echo " - Task Due: " . $task->due_date . "\n";
    }
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
