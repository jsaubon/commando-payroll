<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDateDepositedToDepositTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deposits', function (Blueprint $table) {
            $table->date('date_deposited')->nullable()->after('amount');
            $table->date('bank_transaction_date')->nullable()->after('amount');
            $table->dropColumn('date_transaction');
            $table->dropColumn('date_request');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deposits', function (Blueprint $table) {
            $table->dropColumn(['date_deposited', 'bank_transaction_date']);
        });
    }
}