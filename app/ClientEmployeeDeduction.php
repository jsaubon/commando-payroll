<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientEmployeeDeduction extends Model
{
    protected $guarded = [];

    public function employee() {
        return $this->belongsTo('App\Employee','employee_id');
    }
}
