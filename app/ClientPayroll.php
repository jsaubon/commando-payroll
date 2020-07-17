<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientPayroll extends Model
{
    protected $guarded = [];

    public function client() {
        return $this->belongsTo('App\Client','client_id');
    }

    public function employee() {
        return $this->belongsTo('App\Employee','client_id');
    }

    public function client_employee_accountings() {
        return $this->hasMany('App\ClientEmployeeAccounting','client_accounting_entry_id');
    }
    
}
