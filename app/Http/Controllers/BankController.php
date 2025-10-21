<?php

namespace App\Http\Controllers;

use App\Bank;
use App\ClientBanks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $expiration_date_formatted = "DATE_FORMAT(expiration_date, '%Y-%m-%d')";

        $data = Bank::select([
            "*",

            DB::raw("($expiration_date_formatted) expiration_date"),

        ]);

        $data = $data->where(function ($query) use ($request, $expiration_date_formatted) {
            if ($request->search) {
                $query->orWhere(DB::raw("($expiration_date_formatted)"), 'LIKE', "%$request->search%");
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


        $dataBank = $request->validate([
            'bank_name'       => 'required|string',
            'bank_branch'     => 'required|string',
            'account_name'    => 'required|string',
            'account_type'    => 'required|string',
            'account_number'  => 'required|regex:/^\d+(-\d+)*$/',
            // 'expiration_date' => 'required|date',
        ]);

        try {
            DB::transaction(function () use ($request, $dataBank, &$ret) {
                Bank::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataBank
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
     * @param  \App\Bank  $bank
     * @return \Illuminate\Http\Response
     */
    public function show(Bank $bank)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Bank  $bank
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Bank $bank)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Bank  $bank
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $ret  = [
            "success" => false,
            "message" => "Data not deleted"
        ];

        $findBank = Bank::find($id);

        if ($findBank) {
            if ($findBank->delete()) {
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