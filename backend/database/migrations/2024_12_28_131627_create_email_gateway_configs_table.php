<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('email_gateway_configs', function (Blueprint $table) {
            $table->id();
            $table->string('smtp_host');
            $table->integer('smtp_port');
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('from_email');
            $table->string('from_name');
            $table->enum('encryption', ['TLS', 'SSL', 'NONE'])->default('TLS');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('email_gateway_configs');
    }
};
