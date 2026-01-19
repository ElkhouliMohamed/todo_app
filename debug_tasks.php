<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tasks = App\Models\Task::latest()->take(5)->get(['id', 'title', 'due_date', 'due_time', 'user_id']);
echo json_encode($tasks, JSON_PRETTY_PRINT);
