<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBankIdToDepositsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deposits', function (Blueprint $table) {
            $table->integer('bank_id')->nullable()->after('id');
            $table->double('amount')->default(0)->after('deposit_description');
            $table->date('date_request')->nullable()->after('amount');
            $table->date('date_transaction')->nullable()->after('date_request');
            $table->longText('notes')->nullable()->after('date_transaction');
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
            $table->dropColumn(['bank_id', 'amount', 'date_request', 'date_transaction', 'notes']);
        });
    }
}