<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sms_gateway_configs', function (Blueprint $table) {
            $table->id();
            $table->string('api_key');
            $table->string('api_secret');
            $table->string('sender_id');
            $table->string('api_endpoint');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sms_gateway_configs');
    }
};
