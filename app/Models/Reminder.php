<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    protected $fillable = [
        'task_id',
        'user_id',
        'remind_at',
        'minutes_before',
        'send_email',
        'send_browser',
        'is_sent',
        'sent_at',
        'is_snoozed',
        'snoozed_until',
    ];

    protected function casts(): array
    {
        return [
            'remind_at' => 'datetime',
            'sent_at' => 'datetime',
            'snoozed_until' => 'datetime',
            'send_email' => 'boolean',
            'send_browser' => 'boolean',
            'is_sent' => 'boolean',
            'is_snoozed' => 'boolean',
            'minutes_before' => 'integer',
        ];
    }

    // Relationships
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('is_sent', false)
            ->where('is_snoozed', false);
    }

    public function scopeDue($query)
    {
        return $query->pending()
            ->where('remind_at', '<=', now());
    }

    public function scopeSnoozed($query)
    {
        return $query->where('is_snoozed', true)
            ->where('snoozed_until', '>', now());
    }

    // Helpers
    public function markAsSent(): void
    {
        $this->update([
            'is_sent' => true,
            'sent_at' => now(),
        ]);
    }

    public function snooze(int $minutes): void
    {
        $this->update([
            'is_snoozed' => true,
            'snoozed_until' => now()->addMinutes($minutes),
        ]);
    }
}
