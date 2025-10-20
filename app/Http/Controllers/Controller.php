<?php

namespace App\Http\Controllers;

use GuzzleHttp\Psr7\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;

use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;


    public function client_daily_disbursement(Request $request)
    {
        $month_start = $request->month_start ? $request->month_start : null;
        $month_end = $request->month_end ? $request->month_end : null;
        $client_id = $request->client_id ? $request->client_id : null;

        $client_daily_disbursements = Controller::when($month_start && $month_end, function ($q) use ($month_start, $month_end) {
            $q->whereHas('client_expenses', function ($sub) use ($month_start, $month_end) {
                $sub->whereBetween('date', [$month_start, $month_end]);
            })->orWhereHas('client_deposits', function ($sub) use ($month_start, $month_end) {
                $sub->whereBetween('date', [$month_start, $month_end]);
            });
        })
            ->when($client_id, function ($q) use ($client_id) {
                $q->where('client_id', $client_id);
            })
            ->with(['client', 'client_deposits', 'client_expenses', 'client_banks'])
            ->orderBy('date', 'desc')
            ->get();
        return response()->json($client_daily_disbursements);
    }
}