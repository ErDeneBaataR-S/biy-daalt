<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('manager_id')->nullable()->after('role')->constrained('users')->nullOnDelete();
        });

        Schema::table('employee_tasks', function (Blueprint $table) {
            $table->foreignId('assigned_by_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            $table->foreignId('feedback_item_id')->nullable()->after('assigned_by_id')->constrained()->nullOnDelete();
        });

        Schema::table('workspace_updates', function (Blueprint $table) {
            $table->foreignId('manager_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            $table->string('audience')->default('assigned')->after('status');
        });

        Schema::table('feedback_items', function (Blueprint $table) {
            $table->foreignId('submitted_by_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by_id')->nullable()->after('submitted_by_id')->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('deadline');
        });
    }

    public function down(): void
    {
        Schema::table('feedback_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('submitted_by_id');
            $table->dropConstrainedForeignId('reviewed_by_id');
            $table->dropColumn('approved_at');
        });

        Schema::table('workspace_updates', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manager_id');
            $table->dropColumn('audience');
        });

        Schema::table('employee_tasks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('assigned_by_id');
            $table->dropConstrainedForeignId('feedback_item_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manager_id');
        });
    }
};
