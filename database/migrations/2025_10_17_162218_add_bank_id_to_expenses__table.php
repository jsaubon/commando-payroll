<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBankIdToExpensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->bigInteger('bank_id')->nullable()->after('id');
            $table->double('amount')->default(0)->after('expense_description');
            $table->string('out_standing_check')->nullable()->after('amount');
            $table->string('pdc')->nullable()->after('out_standing_check');
            $table->date('date')->nullable()->after('pdc');
            $table->longText('notes')->nullable()->after('date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn(['bank_id', 'amount', 'out_standing_check', 'pdc', 'notes']);
        });
    }
}