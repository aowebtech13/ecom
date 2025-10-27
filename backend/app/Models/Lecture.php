<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecture extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'title',
        'description',
        'scheduled_at',
        'image_path',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function invites()
    {
        return $this->hasMany(ParentLectureInvite::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }
}
