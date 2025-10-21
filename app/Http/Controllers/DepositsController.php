<?php

namespace App\Http\Controllers;

use App\Client;
use App\ClientDeposit;
use App\Deposits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepositsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index(Request $request)
    {


        $bank_name = "(SELECT `bank_name` FROM `banks` WHERE `banks`.id=deposits.bank_id)";
        $date_deposited_formatted = "DATE_FORMAT(date_deposited, '%Y-%m-%d')";
        $bank_transaction_date = "DATE_FORMAT(bank_transaction_date, '%Y-%m-%d')";


        $data = Deposits::select([
            "*",
            DB::raw($bank_name . " as bank_name"),
            DB::raw($date_deposited_formatted . " as date_deposited_formatted"),
            DB::raw($bank_transaction_date . " as bank_transaction_date_formatted")

        ]);

        $data = $data->where(function ($query) use ($request, $bank_name, $date_deposited_formatted, $bank_transaction_date) {
            if ($request->search) {
                $query->orWhere('deposit_name', 'LIKE', "%$request->search%");
                $query->orWhere('deposit_description', 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($bank_name), 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($date_deposited_formatted), 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($bank_transaction_date), 'LIKE', "%$request->search%");
            }
        });

        if ($request->sort_field && $request->sort_order) {
            if (
                $request->sort_field != '' && $request->sort_field != 'undefined' && $request->sort_field != 'null'  &&
                $request->sort_order != ''  && $request->sort_order != 'undefined' && $request->sort_order != 'null'
            ) {
                $data = $data->orderBy(isset($request->sort_field) ? $request->sort_field : 'id', isset($request->sort_order)  ? $request->sort_order : 'desc');
            }
        } else {
            $data = $data->orderBy('id', 'desc');
        }

        if ($request->bank_id) {
            $data = $data->where('bank_id', $request->bank_id);
        }

        if ($request->page_size) {
            $data = $data->limit($request->page_size)
                ->paginate($request->page_size, ['*'], 'page', $request->page)
                ->toArray();
        } else {
            $data = $data->get();
        }

        return response()->json([
            'success'   => true,
            'data'      => $data
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not " . ($request->id ? "update" : "save"),
        ];

        $dataDeposit = $request->validate([
            'bank_id' => 'required|exists:banks,id',
            'deposit_name' => 'required|string',
            'deposit_description' => 'nullable',
            'amount' => 'required',
            'date_deposited' => 'nullable|date',
            'bank_transaction_date' => 'nullable|date',
            'notes' => 'nullable|string',

        ]);

        try {
            DB::transaction(function () use ($request, $dataDeposit, &$ret) {
                $query = Deposits::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataDeposit
                );

                if ($query) {
                    $ret = [
                        "success" => true,
                        "message" => "Data " . ($request->id ? "updated" : "saved") . " successfully",
                    ];
                }
            });
        } catch (\Throwable $th) {
            //throw $th;
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }



        return response()->json($ret, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Deposits  $deposits
     * @return \Illuminate\Http\Response
     */
    public function show(Deposits $deposits)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Deposits  $deposits
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Deposits $deposits)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Deposits  $deposits
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $ret  = [
            "success" => false,
            "message" => "Data not deleted"
        ];

        $findDeposit = Deposits::find($id);

        if ($findDeposit) {
            try {

                if ($findDeposit->delete()) {
                    $ret = [
                        "success" => true,
                        "message" => "Data deleted successfully"
                    ];
                }
            } catch (\Throwable $th) {
                $ret['message'] = "An error occurred: " . $th->getMessage();
            }
        }

        //

        return response()->json($ret, 200);
    }
}