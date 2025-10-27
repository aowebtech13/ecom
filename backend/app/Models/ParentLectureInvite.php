<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentLectureInvite extends Model
{
    use HasFactory;

    protected $fillable = [
        'lecture_id',
        'parent_email',
        'invite_token',
        'is_used',
    ];

    protected $casts = [
        'is_used' => 'boolean',
    ];

    public function lecture()
    {
        return $this->belongsTo(Lecture::class);
    }
}
