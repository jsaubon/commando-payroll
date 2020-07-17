<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $guarded = [];

    public function other_info()
    {
        return $this->morphMany('App\OtherInfo', 'other_infoable');
    }

    public function employees() {
        return $this->hasMany('App\Employee','client_id');
    }

    public function client_payrolls() {
        return $this->hasMany('App\ClientPayroll','client_id');
    }
}