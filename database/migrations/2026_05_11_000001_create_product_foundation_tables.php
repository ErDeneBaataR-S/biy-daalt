<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->string('owner')->nullable();
            $table->timestamps();
        });

        Schema::create('backlog_items', function (Blueprint $table) {
            $table->id();
            $table->string('kind')->default('feature');
            $table->string('title');
            $table->string('status')->default('planned');
            $table->string('priority')->default('medium');
            $table->string('owner')->nullable();
            $table->string('team')->nullable();
            $table->string('sprint_label')->nullable();
            $table->string('estimate_label')->nullable();
            $table->unsignedInteger('position')->default(1);
            $table->timestamps();
        });

        Schema::create('roadmap_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('status')->default('now');
            $table->unsignedInteger('position')->default(1);
            $table->timestamps();
        });

        Schema::create('feedback_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('Open');
            $table->string('priority')->default('Medium');
            $table->date('deadline')->nullable();
            $table->timestamps();
        });

        Schema::create('product_releases', function (Blueprint $table) {
            $table->id();
            $table->string('version');
            $table->date('release_date')->nullable();
            $table->json('features')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_releases');
        Schema::dropIfExists('feedback_items');
        Schema::dropIfExists('roadmap_items');
        Schema::dropIfExists('backlog_items');
        Schema::dropIfExists('projects');
    }
};
