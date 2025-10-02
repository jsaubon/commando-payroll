<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientBanks extends Model
{
    protected $guarded = [];


    public function client()
    {
        return $this->belongsTo('App\Client', 'client_id');
    }
    public function bank()
    {
        return $this->belongsTo('App\Bank', 'bank_id');
    }
}