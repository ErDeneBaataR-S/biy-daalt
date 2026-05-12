<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type')->default('assigned');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('todo');
            $table->string('priority')->default('medium');
            $table->date('due_date')->nullable();
            $table->timestamps();
        });

        Schema::create('workspace_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workspace_updates');
        Schema::dropIfExists('employee_tasks');
    }
};
