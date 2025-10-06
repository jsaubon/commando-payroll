<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientExpensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_expenses', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('client_id')->nullable();
            $table->bigInteger('expenses_id')->nullable();
            $table->double('amount')->default(0);
            $table->date('date')->nullable();
            $table->longText('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('client_expenses');
    }
}