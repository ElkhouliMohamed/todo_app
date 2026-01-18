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
        Schema::create('task_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('task_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('reminder_id')->nullable()->constrained()->onDelete('set null');

            // Notification details
            $table->enum('type', ['reminder', 'task_due', 'task_overdue', 'task_completed'])->default('reminder');
            $table->enum('channel', ['email', 'browser', 'both'])->default('both');

            $table->string('title');
            $table->text('message')->nullable();
            $table->json('data')->nullable(); // Additional metadata

            // Status
            $table->boolean('is_read')->default(false);
            $table->dateTime('read_at')->nullable();
            $table->dateTime('sent_at')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'is_read']);
            $table->index(['user_id', 'created_at']);
            $table->index('task_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_notifications');
    }
};
