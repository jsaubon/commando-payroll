<?php

namespace App\Http\Controllers;

use App\ClientBanks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientBanksController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $bank_name = "(SELECT `bank_name` FROM `banks` WHERE `banks`.id=client_banks.bank_id)";

        $data = ClientBanks::select([
            "*",
            DB::raw("($bank_name) bank_name"),

        ]);

        $data = $data->where(function ($query) use ($request, $bank_name) {
            if ($request->search) {
                $query->orWhere('notes', 'LIKE', "%$request->search%");
                $query->orWhere(DB::raw($bank_name), 'LIKE', "%$request->search%");
            }
        });
        if ($request->client_id) {
            $data = $data->where('client_id', $request->client_id);
        }
        if ($request->bank_id) {
            $data = $data->where('bank_id', $request->bank_id);
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

        $dataClientBank = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'bank_id' => 'required|exists:banks,id',
            'notes' => 'nullable|string',

        ]);

        try {
            DB::transaction(function () use ($request, $dataClientBank, &$ret) {

                ClientBanks::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataClientBank
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
     * @param  \App\ClientBanks  $clientBanks
     * @return \Illuminate\Http\Response
     */
    public function show(ClientBanks $clientBanks)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClientBanks  $clientBanks
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientBanks $clientBanks)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClientBanks  $clientBanks
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientBanks $clientBanks)
    {
        //
    }
}