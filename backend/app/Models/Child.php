<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'lecture_id',
        'name',
        'age',
    ];

    protected $casts = [
        'age' => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function lecture()
    {
        return $this->belongsTo(Lecture::class);
    }
}
