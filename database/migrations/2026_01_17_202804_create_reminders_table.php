<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Reminder timing
            $table->dateTime('remind_at');
            $table->integer('minutes_before')->nullable(); // 30, 60, 1440 (1 day), etc.

            // Notification channels
            $table->boolean('send_email')->default(true);
            $table->boolean('send_browser')->default(true);

            // Status
            $table->boolean('is_sent')->default(false);
            $table->dateTime('sent_at')->nullable();
            $table->boolean('is_snoozed')->default(false);
            $table->dateTime('snoozed_until')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['task_id', 'is_sent']);
            $table->index(['user_id', 'remind_at']);
            $table->index(['remind_at', 'is_sent']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
