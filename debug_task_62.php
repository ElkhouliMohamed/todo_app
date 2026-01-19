<?php

use App\Models\Task;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$task = Task::find(62);
if ($task) {
    echo "Task found.\n";
    echo "Title: " . $task->title . "\n";
    echo "Due Date (Raw): " . var_export($task->getAttributes()['due_date'], true) . "\n";
    echo "Due Date (Object): " . var_export($task->due_date, true) . "\n";
} else {
    echo "Task 62 not found.\n";
}
