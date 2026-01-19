<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$task = App\Models\Task::find(34);
if ($task) {
    $task->due_date = now();
    $task->save();
    echo "Task 34 updated with due date " . $task->due_date;
} else {
    echo "Task 34 not found";
}
