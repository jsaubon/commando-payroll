<?php

namespace App\Http\Controllers;

use App\ClientExpenses;
use App\Expenses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {


        $bank_name = "(SELECT `bank_name` FROM `banks` WHERE `banks`.id=expenses.bank_id)";
        $date_formatted = "DATE_FORMAT(date, '%Y-%m-%d')";
        $data = Expenses::select([
            "*",
            DB::raw($bank_name . " AS bank_name"),
            DB::raw($date_formatted . " AS date_formatted")

        ]);

        $data = $data->where(function ($query) use ($request, $bank_name, $date_formatted) {
            if ($request->search) {
                $query->orWhere('expense_name', 'LIKE', "%$request->search%");
                $query->orWhere('expense_description', 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($bank_name), 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($date_formatted), 'LIKE', "%$request->search%");
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

        $dataExpense = $request->validate([
            'bank_id' => 'required|exists:banks,id',
            'expense_name' => 'required|string',
            'expense_description' => 'required|string',
            'amount' => 'required',
            'date' => 'required|date',
            'out_standing_check' => 'nullable',
            'pdc' => 'nullable',
            'notes' => 'nullable|string',


        ]);

        try {
            DB::transaction(function () use ($request, $dataExpense, &$ret) {
                $query = Expenses::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataExpense
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
     * @param  \App\Expenses  $expenses
     * @return \Illuminate\Http\Response
     */
    public function show(Expenses $expenses) {}

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Expenses  $expenses
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Expenses $expenses)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Expenses  $expenses
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $ret  = [
            "success" => false,
            "message" => "Data not deleted"
        ];

        $findExpense = Expenses::find($id);

        if ($findExpense) {
            if ($findExpense->delete()) {
                $ret  = [
                    "success" => true,
                    "message" => "Data deleted successfully"
                ];
            }
        }

        //

        return response()->json($ret, 200);
    }
}