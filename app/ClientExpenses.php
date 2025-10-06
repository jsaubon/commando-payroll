<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientExpenses extends Model
{
    protected $guarded = [];
    public function client()
    {
        return $this->belongsTo('App\Client', 'client_id');
    }
    public function expenses()
    {
        return $this->belongsTo('App\Expenses', 'expenses_id');
    }
}