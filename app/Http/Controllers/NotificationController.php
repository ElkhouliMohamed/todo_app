<?php

namespace App\Http\Controllers;

use App\Models\TaskNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get user notifications
     */
    public function index()
    {
        $notifications = TaskNotification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        return $notifications;
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($id)
    {
        $notification = TaskNotification::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        return response()->json(['message' => 'Marked as read']);
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead()
    {
        TaskNotification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['message' => 'All marked as read']);
    }
}
