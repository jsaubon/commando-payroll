<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRestDaysInTableClientEmployeePayrollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('client_employee_payrolls', function (Blueprint $table) {
            $table->integer('days_of_work_rest_day')->nullable();
            $table->integer('night_pay_rest_day')->nullable();
            $table->integer('hours_overtime_rest_day')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('client_employee_payrolls', function (Blueprint $table) {
            $table->dropColumn('days_of_work_rest_day');
            $table->dropColumn('night_pay_rest_day');
            $table->dropColumn('hours_overtime_rest_day');
        });
    }
}
