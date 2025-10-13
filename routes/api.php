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

    Route::apiResource('user', 'UserController');
    Route::apiResource('client', 'ClientController');
    Route::apiResource('employee', 'ClientEmployeeController');
    Route::apiResource('other_info', 'OtherInfoController');
    Route::apiResource('accounting_entry', 'ClientAccountingEntryController');
    Route::apiResource('employee_accounting', 'ClientEmployeeAccountingController');
    Route::apiResource('employee_deduction', 'ClientEmployeeDeductionController');
    Route::apiResource('payroll', 'ClientPayrollController');
    Route::apiResource('employee_payroll', 'ClientEmployeePayrollController');
    Route::apiResource('employee_assigned_post', 'ClientEmployeeAssignedPostController');

    Route::apiResource('banks', 'BankController');
    Route::apiResource('expenses', 'ExpensesController');
    Route::apiResource('deposits', 'DepositsController');
    Route::apiResource('client_banks', 'ClientBanksController');
    Route::apiResource('client_expenses', 'ClientExpensesController');
    Route::apiResource('client_deposits', 'ClientDepositController');
    // Route::apiResource('client_daily_disbursement', 'ClientDailyDisbursementController');

    Route::post('client/logo', 'ClientController@uploadLogo');
});

Route::get('testing', function () {
    $employees = \App\ClientEmployee::where('id', 3)
        ->with(['bonds', 'client'])
        ->get()->toArray();

    dd($employees);
});
Route::get('get_report_daily_disbursement', function () {
    $client_id = request()->client_id ?? null;
    $month_start = request()->month_start ? date('Y-m-01', strtotime(request()->month_start)) : null;
    $month_end = request()->month_end ? date('Y-m-t', strtotime(request()->month_end)) : null;

    $client_bank_info = "(SELECT 
        CONCAT(
            bank_name, ' ', '(', account_type, '.', ' ', '#', account_number, ' - ',
            CASE 
                WHEN (SELECT type FROM clients WHERE clients.id = client_banks.client_id) = 'Commando'
                    THEN 'COMMANDO SECURITY SERVICE AGENCY, INC.'
                WHEN (SELECT type FROM clients WHERE clients.id = client_banks.client_id) = 'First Commando'
                    THEN 'FIRST COMMANDO MANPOWER SERVICES'
                ELSE (SELECT type FROM clients WHERE clients.id = client_banks.client_id)
            END,
            ')'
        )
    FROM banks WHERE banks.id = client_banks.bank_id)";

    $client_banks = \App\ClientBanks::query()
        ->select([
            \DB::raw('MIN(id) as id'),
            'client_id',
            'bank_id',
            \DB::raw($client_bank_info . ' AS client_bank_info')
        ])
        ->groupBy('bank_id', 'client_id')
        ->when(!empty($client_id), fn($q) => $q->where('client_id', $client_id))
        ->get();

    $bankGroups = [];
    foreach ($client_banks as $bank) {
        $bank_key = $bank->bank_id;
        if (!isset($bankGroups[$bank_key])) {
            $bankGroups[$bank_key] = [
                'client_bank_info' => $bank->client_bank_info,
                'client_ids' => []
            ];
        }
        $bankGroups[$bank_key]['client_ids'][] = $bank->client_id;
    }

    $dataResult = [];

    foreach ($bankGroups as $bank_id => $bankGroup) {


        $client_ids = $bankGroup['client_ids'];

        $forwarded_balance = 0;
        $forwarded_balance_range = null;

        if ($month_start) {
            $first_deposit = \App\ClientDeposit::whereIn('client_id', $client_ids)
                ->orderBy('date', 'asc')
                ->first();

            if ($first_deposit) {
                $forwarded_balance_range = [
                    'start_date' => $first_deposit->date,
                    'end_date' => date('Y-m-d', strtotime($month_start . ' -1 day')),
                ];
            }

            $forwarded_balance = \App\ClientDeposit::whereIn('client_id', $client_ids)
                ->whereDate('date', '<', $month_start)
                ->sum('amount')
                -
                \App\ClientExpenses::whereIn('client_id', $client_ids)
                ->whereDate('date', '<', $month_start)
                ->sum('amount');
        }

        $client_deposit_client_name = "(SELECT name FROM clients WHERE clients.id=client_deposits.client_id) AS client_deposit_client_name";
        $client_deposit_client_description = "(SELECT deposit_description FROM deposits WHERE deposits.id=client_deposits.deposit_id) AS client_deposit_client_description";

        $dataClientDeposits = \App\ClientDeposit::whereIn('client_id', $client_ids)
            ->when($month_start && $month_end, fn($q) => $q->whereBetween('date', [$month_start, $month_end]))
            ->select([
                'client_deposits.*',
                \DB::raw($client_deposit_client_name),
                \DB::raw($client_deposit_client_description)
            ])
            ->orderBy('date', 'asc')
            ->get();

        $total_deposits = 0;

        $total_deposits = $dataClientDeposits->sum('amount');

        $client_expense_client_name = "(SELECT name FROM clients WHERE clients.id=client_expenses.client_id) AS client_expense_client_name";
        $client_expense_name = "(SELECT expense_name FROM expenses WHERE expenses.id=client_expenses.expenses_id) AS client_expense_name";
        $client_expense_client_description = "(SELECT expense_description FROM expenses WHERE expenses.id=client_expenses.expenses_id) AS client_expense_client_description";
        $dataClientExpenses = \App\ClientExpenses::whereIn('client_id', $client_ids)
            ->when($month_start && $month_end, fn($q) => $q->whereBetween('date', [$month_start, $month_end]))
            ->select([
                'client_expenses.*',
                \DB::raw($client_expense_client_name),
                \DB::raw($client_expense_client_description),
                \DB::raw($client_expense_name)
            ])
            ->orderBy('date', 'asc')
            ->get();

        $total_expenses = 0;
        $subtotal_deposits = 0;
        $subtotal_expenses = 0;
        $total_daily_disbursement = 0;

        $total_expenses = $dataClientExpenses->sum('amount');

        $subtotal_deposits = $forwarded_balance + $total_deposits;
        $subtotal_expenses = $subtotal_deposits - $total_expenses;
        $total_daily_disbursement = $subtotal_expenses;

        $dataResult[] = [
            'client_bank_info' => $bankGroup['client_bank_info'],
            'forwarded_balance' => $forwarded_balance,
            'forwarded_balance_range' => $forwarded_balance_range,
            'deposits' => $dataClientDeposits,
            'expenses' => $dataClientExpenses,
            'subtotal_deposits' => $subtotal_deposits,
            'subtotal_expenses' => $subtotal_expenses,
            'total_deposits' => $total_deposits,
            'total_expenses' => $total_expenses,
            'total_daily_disbursement' => $total_daily_disbursement,
        ];
    }

    return response()->json(['success' => true, 'data' => $dataResult]);
});
