<?php

use App\Models\RecurringTask;
use App\Models\Task;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$recurringTasks = RecurringTask::all();

echo "Found " . $recurringTasks->count() . " recurring tasks.\n";

foreach ($recurringTasks as $rt) {
    echo "--------------------------------------------------\n";
    echo "ID: " . $rt->id . "\n";
    echo "Title: " . $rt->title . "\n";
    echo "Start Date: " . $rt->start_date . "\n";
    echo "Recurrence Type: " . $rt->recurrence_type . "\n";
    echo "Interval: " . $rt->recurrence_interval . "\n";
    echo "Day of Month: " . ($rt->recurrence_day_of_month ?? 'NULL') . "\n";
    echo "Recurrence Days: " . json_encode($rt->recurrence_days) . "\n";
    echo "Last Generated: " . ($rt->last_generated_date ?? 'NULL') . "\n";
    echo "Is Active: " . ($rt->is_active ? 'Yes' : 'No') . "\n";

    $tasks = Task::where('recurring_task_id', $rt->id)->get();
    echo "Generated Tasks Count: " . $tasks->count() . "\n";
    foreach ($tasks as $t) {
        echo " - Task ID: " . $t->id . " | Due: " . $t->due_date . "\n";
    }
}
