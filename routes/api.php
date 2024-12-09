<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::post('login', 'PassportController@login');
Route::post('register', 'PassportController@register');

Route::middleware('auth:api')->group(function () {
    Route::get('user', 'PassportController@details');

    Route::apiResource('user','UserController');
    Route::apiResource('client','ClientController');
    Route::apiResource('employee','ClientEmployeeController');
    Route::apiResource('other_info','OtherInfoController');
    Route::apiResource('accounting_entry','ClientAccountingEntryController');
    Route::apiResource('employee_accounting','ClientEmployeeAccountingController');
    Route::apiResource('employee_deduction','ClientEmployeeDeductionController');
    Route::apiResource('payroll','ClientPayrollController');
    Route::apiResource('employee_payroll','ClientEmployeePayrollController');
    Route::apiResource('employee_assigned_post','ClientEmployeeAssignedPostController');

    Route::post('client/logo','ClientController@uploadLogo');
});

Route::get('testing', function() {
    $employees = \App\ClientEmployee::where('id',3)
            ->with(['bonds','client'])
            ->get()->toArray();

    dd($employees);
});
Route::get('populate_rest_day', function() {
    $clients = \App\Client::all();
    foreach($clients as $client) {
        $client_accounting_entries = \App\ClientAccountingEntry::updateOrCreate([
            'client_id' => $client->id,
            'title' => 'Rest Day Pay',
            'type' => 'debit',
        ],[
            'client_id' => $client->id,
            'visible' => 0,
            'type' => 'debit',
            'title' => 'Rest Day Pay',
            'amount' => 0,
            'order' => 2,
            'fixed' => 0,
            'fixed_amount' => 0
        ]);

        $client_accounting_entries = \App\ClientAccountingEntry::updateOrCreate([
            'client_id' => $client->id,
            'title' => 'Night Rest Day Pay',
            'type' => 'debit',
        ],[
            'client_id' => $client->id,
            'visible' => 0,
            'type' => 'debit',
            'title' => 'Night Rest Day Pay',
            'amount' => 0,
            'order' => 5,
            'fixed' => 0,
            'fixed_amount' => 0
        ]);

        $client_accounting_entries = \App\ClientAccountingEntry::updateOrCreate([
            'client_id' => $client->id,
            'title' => 'Overtime Rest Day Pay',
            'type' => 'debit',
        ],[
            'client_id' => $client->id,
            'visible' => 0,
            'type' => 'debit',
            'title' => 'Overtime Rest Day Pay',
            'amount' => 0,
            'order' => 15,
            'fixed' => 0,
            'fixed_amount' => 0
        ]);

    }

});