<?php

namespace App\Http\Controllers;

use App\ClientEmployeePayroll;
use Illuminate\Http\Request;

class ClientEmployeePayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $payrolls = ClientEmployeePayroll::select(['client_employee_payrolls.*'])
                                ->with('client_employee')
                                ->with('client_payroll')
                                ->with('client_payroll.client')
                                ->with('client_employee_accountings')
                                ->with('client_employee_accountings.client_accounting_entry')
                                ->join('client_payrolls','client_employee_payrolls.client_payroll_id','=','client_payrolls.id');

        // $payrolls->where('client_employee_payrolls.amount','!=',0);
        
        if(isset($request->payroll_date)) {
            $payrolls->whereRaw('? between client_payrolls.date_start and client_payrolls.date_end', [$request->payroll_date]);
        } 

        if(isset($request->payroll_month_start)) {
            $payroll_month_start = explode('-',$request->payroll_month_start);
            $start_year = $payroll_month_start[0];
            $start_month = $payroll_month_start[1];
            $payroll_month_end = explode('-',$request->payroll_month_end);
            $end_year = $payroll_month_end[0];
            $end_month = $payroll_month_end[1];

            $payrolls->whereRaw('(YEAR(client_payrolls.date_start) = ? && YEAR(client_payrolls.date_end) = ?) && (MONTH(client_payrolls.date_start) >= ? && MONTH(client_payrolls.date_end) <= ?)', [$start_year, $end_year, $start_month, $end_month]);
        }
        \DB::connection()->enableQueryLog();
        $payrolls = $payrolls->get();
                        // ->sortBy('client_payroll.date_start')
                        // ->sortBy('client_payroll.client.name')
                        // ->sortBy('client_employee.name')->toArray();

        $query = \DB::getQueryLog();
        return response()->json([
            'success' => true,
            'data' => $payrolls,
            'request' => $request->all(),
            'query' => $query
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ClientEmployeePayroll  $clientEmployeePayroll
     * @return \Illuminate\Http\Response
     */
    public function show(ClientEmployeePayroll $clientEmployeePayroll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClientEmployeePayroll  $clientEmployeePayroll
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientEmployeePayroll $clientEmployeePayroll)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClientEmployeePayroll  $clientEmployeePayroll
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientEmployeePayroll $clientEmployeePayroll)
    {
        //
    }
}
