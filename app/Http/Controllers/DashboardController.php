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
        // Get statistics (Monthly)
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $stats = [
            'total' => Task::where('user_id', $user->id)
                ->whereBetween('due_date', [$startOfMonth, $endOfMonth])
                ->count(),
            'pending' => Task::where('user_id', $user->id)
                ->where('status', 'pending')
                ->whereBetween('due_date', [$startOfMonth, $endOfMonth])
                ->count(),
            'completed' => Task::where('user_id', $user->id)
                ->where('status', 'completed')
                ->whereBetween('due_date', [$startOfMonth, $endOfMonth])
                ->count(),
            'overdue' => Task::where('user_id', $user->id)
                ->where('status', '!=', 'completed')
                ->whereNotNull('due_date')
                ->where('due_date', '<', now())
                ->count(), // Overdue is cumulative, but if "monthly stats", maybe just overdue *from this month*? 
            // Usually overdue means "overdue right now" regardless of when it was due. 
            // Keeping it as global overdue makes more sense for "Overdue", or we can stick to the plan strictly.
            // Let's stick to global overdue as it's a critical alert, OR align with "Monthly Info".
            // User asked "make dashbord info by mounth". Overdue from last year is still cluttering the dashboard?
            // Let's assume "info by month" implies filters. 
            // But "Overdue" specifically usually means "Action Required Now".
            // I will keep Overdue as is (Global) because hiding an overdue task from last month is dangerous.
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
            ->where('due_date', '>=', today())
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
