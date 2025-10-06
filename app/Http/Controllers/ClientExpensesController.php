<?php

namespace App\Http\Controllers;

use App\ClientExpenses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $expense_name = "(SELECT `expense_name` FROM `expenses` WHERE `expenses`.id=client_expenses.expenses_id)";
        $date_formatted = "DATE_FORMAT(date, '%Y/%m/%d')";


        $data = ClientExpenses::select([
            "*",
            DB::raw("($expense_name) expense_name"),
            DB::raw("($date_formatted) date_formatted")

        ]);

        $data = $data->where(function ($query) use ($request, $expense_name, $date_formatted) {
            if ($request->search) {
                $query->orWhere('notes', 'LIKE', "%$request->search%");
                $query->orWhere('amount', 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($expense_name), 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($date_formatted), 'LIKE', "%$request->search%");
            }
        });
        if ($request->client_id) {
            $data = $data->where('client_id', $request->client_id);
        }
        if ($request->expenses_id) {
            $data = $data->where('expenses_id', $request->expenses_id);
        }


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

        $dataClientExpenses = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'expenses_id' => 'required|exists:expenses,id',
            'amount' => 'nullable|numeric',
            'date' => 'nullable|date',
            'notes' => 'nullable|string',

        ]);

        try {
            DB::transaction(function () use ($request, $dataClientExpenses, &$ret) {

                ClientExpenses::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataClientExpenses
                );

                $ret['success'] = true;
                $ret['message'] = "Data " . ($request->id ? "updated" : "saved") . " successfully";
            });
        } catch (\Throwable $th) {
            //throw $th;
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }


        $ret['request'] = $request->all();

        return response()->json($ret, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ClientExpenses  $clientExpenses
     * @return \Illuminate\Http\Response
     */
    public function show(ClientExpenses $clientExpenses)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClientExpenses  $clientExpenses
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientExpenses $clientExpenses)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClientExpenses  $clientExpenses
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientExpenses $clientExpenses)
    {
        //
    }
}