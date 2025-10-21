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


    Route::post('client/logo', 'ClientController@uploadLogo');
});

Route::get('testing', function () {
    $employees = \App\ClientEmployee::where('id', 3)
        ->with(['bonds', 'client'])
        ->get()->toArray();

    dd($employees);
});

Route::get('get_report_daily_disbursement', function () {
    $month = request()->month;
    $bank_id = request()->bank_id;

    $year = null;
    $monthNum = null;
    if ($month) {
        [$year, $monthNum] = explode('-', $month);
    }

    $bank_info_formatted = "(SELECT 
        CONCAT(
            bank_name, ' ', '(', account_type, '.', ' ', '#', account_number, ' - ',
            CASE 
                WHEN (SELECT type FROM clients WHERE clients.id = deposits.bank_id) = 'Commando'
                    THEN 'COMMANDO SECURITY SERVICE AGENCY, INC.'
                WHEN (SELECT type FROM clients WHERE clients.id = deposits.bank_id) = 'First Commando'
                    THEN 'FIRST COMMANDO MANPOWER SERVICES'
                ELSE (SELECT type FROM clients WHERE clients.id = deposits.bank_id)
            END,
            ')'
        )
    FROM banks WHERE banks.id = deposits.bank_id)";

    $bank_info_formatted_expenses = "(SELECT 
        CONCAT(
            bank_name, ' ', '(', account_type, '.', ' ', '#', account_number, ' - ',
            CASE 
                WHEN (SELECT type FROM clients WHERE clients.id = expenses.bank_id) = 'Commando'
                    THEN 'COMMANDO SECURITY SERVICE AGENCY, INC.'
                WHEN (SELECT type FROM clients WHERE clients.id = expenses.bank_id) = 'First Commando'
                    THEN 'FIRST COMMANDO MANPOWER SERVICES'
                ELSE (SELECT type FROM clients WHERE clients.id = expenses.bank_id)
            END,
            ')'
        )
    FROM banks WHERE banks.id = expenses.bank_id)";

    $date_deposited_formatted = "DATE_FORMAT(date_deposited, '%Y-%m-%d')";
    $bank_transaction_date = "DATE_FORMAT(bank_transaction_date, '%Y-%m-%d')";



    $dataDeposit = App\Deposits::selectRaw("
        deposits.*,
        {$bank_info_formatted} AS bank_info_formatted,
        {$date_deposited_formatted} AS date_deposited_formatted,
        {$bank_transaction_date} AS bank_transaction_date_formatted")
        ->when($bank_id, fn($q) => $q->where('bank_id', $bank_id))
        ->when($year && $monthNum, fn($q) => $q->whereYear('date_deposited', $year)->whereMonth('date_deposited', $monthNum))
        ->where('amount', '>', 0)
        ->get();

    $dataExpenses = App\Expenses::select([
        'expenses.*',
        \DB::raw($bank_info_formatted_expenses . ' AS bank_info_formatted'),

    ])
        ->when($year && $monthNum, fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
        ->when($bank_id, fn($q) => $q->where('bank_id', $bank_id))

        ->where('pdc', 0)
        ->where('out_standing_check', 0)
        ->get();

    $dataOutStandingChecks = App\Expenses::select([
        'expenses.*',
        \DB::raw($bank_info_formatted_expenses . ' AS bank_info_formatted'),


    ])
        ->when($year && $monthNum, fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
        ->when($bank_id, fn($q) => $q->where('bank_id', $bank_id))
        ->where('out_standing_check', 1)
        ->get();

    $dataPDC = App\Expenses::select([
        'expenses.*',
        \DB::raw($bank_info_formatted_expenses . ' AS bank_info_formatted'),

    ])
        ->when($year && $monthNum, fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
        ->when($bank_id, fn($q) => $q->where('bank_id', $bank_id))

        ->where('pdc', 1)
        ->get();

    $groupedData = [];

    $bankIds = collect($dataDeposit->pluck('bank_id'))
        ->merge($dataExpenses->pluck('bank_id'))
        ->merge($dataOutStandingChecks->pluck('bank_id'))
        ->merge($dataPDC->pluck('bank_id'))
        ->unique();

    foreach ($bankIds as $bankId) {
        $forwarded_balance = 0;
        $forwarded_balance_month_range = null;

        $deposits_total_amount = $dataDeposit->where('bank_id', $bankId)->sum('amount');
        $expenses_total_amount = $dataExpenses->where('bank_id', $bankId)->sum('amount');
        $total_outstandingcheck_amount = $dataOutStandingChecks->where('bank_id', $bankId)->sum('amount');
        $total_pdc_amount = $dataPDC->where('bank_id', $bankId)->sum('amount');
        $subtotal_deposits = $forwarded_balance + $deposits_total_amount;

        $subtotal_expenses = $subtotal_deposits - $expenses_total_amount;
        $subtotal_outstandingcheck = $subtotal_expenses - $total_outstandingcheck_amount;
        $subtotal_pdc = $subtotal_outstandingcheck - $total_pdc_amount;

        $total_daily_disbursement = $subtotal_pdc;

        $bankInfo = $dataDeposit->where('bank_id', $bankId)->first()->bank_info_formatted
            ?? $dataExpenses->where('bank_id', $bankId)->first()->bank_info_formatted
            ?? $dataOutStandingChecks->where('bank_id', $bankId)->first()->bank_info_formatted
            ?? $dataPDC->where('bank_id', $bankId)->first()->bank_info_formatted
            ?? '';

        // Calculate forwarded balance from previous month
        if ($month) {
            $prevMonth = date('Y-m', strtotime($month . '-01 -1 month'));
            $forwarded_balance_month_range = date('Y-m-t', strtotime($prevMonth));

            $fbmoDeposits = \App\Deposits::where('bank_id', $bankId)
                ->whereYear('date_deposited', date('Y', strtotime($prevMonth)))
                ->whereMonth('date_deposited', date('m', strtotime($prevMonth)))
                ->sum('amount', $deposits_total_amount);

            $prevExpenses = \App\Expenses::where('bank_id', $bankId)
                ->whereYear('date', date('Y', strtotime($prevMonth)))
                ->whereMonth('date', date('m', strtotime($prevMonth)))
                ->where('pdc', 0)
                ->where('out_standing_check', 0)
                ->sum('amount', $expenses_total_amount);

            $prevOutstanding = \App\Expenses::where('bank_id', $bankId)
                ->whereYear('date', date('Y', strtotime($prevMonth)))
                ->whereMonth('date', date('m', strtotime($prevMonth)))
                ->where('out_standing_check', 1)
                ->sum('amount', $total_outstandingcheck_amount);

            $prevPdc = \App\Expenses::where('bank_id', $bankId)
                ->whereYear('date', date('Y', strtotime($prevMonth)))
                ->whereMonth('date', date('m', strtotime($prevMonth)))
                ->where('pdc', 1)
                ->sum('amount', $total_pdc_amount);

            $forwarded_balance = $fbmoDeposits - $prevExpenses - $prevOutstanding - $prevPdc;
        }


        $groupedData[] = [
            'bank_info_formatted' => $bankInfo,
            'deposits' => $dataDeposit->where('bank_id', $bankId)->values(),
            'expenses' => $dataExpenses->where('bank_id', $bankId)->values(),
            'outstanding_checks' => $dataOutStandingChecks->where('bank_id', $bankId)->values(),
            'pdc' => $dataPDC->where('bank_id', $bankId)->values(),
            'deposits_total_amount' => $deposits_total_amount,
            'subtotal_deposits' => $subtotal_deposits,
            'subtotal_expenses' => $subtotal_expenses,
            'subtotal_outstandingcheck' => $subtotal_outstandingcheck,
            'subtotal_pdc' => $subtotal_pdc,
            'forward_balance' => $forwarded_balance,
            'total_daily_disbursement' => $total_daily_disbursement,
            'forwarded_balance_month_range' => $forwarded_balance_month_range,
        ];
    }

    return response()->json(['success' => true, 'data' => $groupedData]);
});