<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SocialAuth extends Model
{
    //
    public $timestamps = false;

    protected $fillable = ['user_id', 'provider_id', 'provider'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
