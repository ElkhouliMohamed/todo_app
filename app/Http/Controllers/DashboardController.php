<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get statistics
        $stats = [
            'total' => Task::where('user_id', $user->id)->count(),
            'pending' => Task::where('user_id', $user->id)->where('status', 'pending')->count(),
            'completed' => Task::where('user_id', $user->id)->where('status', 'completed')->count(),
            'overdue' => Task::where('user_id', $user->id)
                ->where('status', '!=', 'completed')
                ->whereNotNull('due_date')
                ->where('due_date', '<', now())
                ->count(),
        ];

        // Get recent tasks (last 5)
        $recentTasks = Task::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Get upcoming tasks (next 5 tasks with due dates)
        $upcomingTasks = Task::where('user_id', $user->id)
            ->where('status', '!=', 'completed')
            ->whereNotNull('due_date')
            ->where('due_date', '>=', now())
            ->orderBy('due_date')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentTasks' => $recentTasks,
            'upcomingTasks' => $upcomingTasks,
        ]);
    }
}
