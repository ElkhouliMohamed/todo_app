<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recurring_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Task template
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->json('tags')->nullable();
            $table->string('color')->nullable();
            
            // Recurrence pattern
            $table->enum('recurrence_type', ['daily', 'weekly', 'monthly', 'custom'])->default('daily');
            $table->integer('recurrence_interval')->default(1); // Every X days/weeks/months
            
            // Weekly recurrence (for weekly type)
            $table->json('recurrence_days')->nullable(); // [1,3,5] for Mon, Wed, Fri
            
            // Monthly recurrence (for monthly type)
            $table->integer('recurrence_day_of_month')->nullable(); // Day 1-31
            
            // Time settings
            $table->time('recurrence_time')->nullable();
            $table->boolean('is_all_day')->default(false);
            
            // Start and end conditions
            $table->date('start_date');
            $table->enum('end_type', ['never', 'after_occurrences', 'on_date'])->default('never');
            $table->integer('end_after_occurrences')->nullable();
            $table->date('end_date')->nullable();
            
            // Tracking
            $table->integer('occurrences_created')->default(0);
            $table->date('last_generated_date')->nullable();
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['user_id', 'is_active']);
            $table->index('start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurring_tasks');
    }
};
