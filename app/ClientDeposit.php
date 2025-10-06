<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientDeposit extends Model
{
    protected $guarded = [];
    public function client()
    {
        return $this->belongsTo('App\Client', 'client_id');
    }
    public function deposit()
    {
        return $this->belongsTo('App\Deposits', 'deposit_id');
    }
}