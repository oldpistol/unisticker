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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('vehicle_brand_model_id');
            $table->string('vehicle_plate_no');
            $table->string('vehicle_type');
            $table->string('vehicle_color');
            $table->boolean('is_vehicle_owner')->default(false);
            $table->string('owner_full_name')->nullable();
            $table->string('road_tax_expiry_date')->nullable();
            $table->string('insurance_name')->nullable();
            $table->string('insurance_number')->nullable();
            $table->string('driving_license_no')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
