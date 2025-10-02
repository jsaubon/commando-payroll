<?php

namespace App\Http\Controllers;

use App\Bank;
use App\ClientReport;
use Illuminate\Http\Request;

class ClientReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
     * @param  \App\ClientReport  $clientReport
     * @return \Illuminate\Http\Response
     */
    public function show(ClientReport $clientReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClientReport  $clientReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientReport $clientReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClientReport  $clientReport
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientReport $id) {}
}