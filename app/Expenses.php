<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Expenses extends Model
{
    protected $guarded = [];


    public function bank()
    {
        return $this->belongsTo(Bank::class, 'bank_id');
    }
}