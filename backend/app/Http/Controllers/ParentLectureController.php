<?php

namespace App\Http\Controllers;

use App\Models\Lecture;

class ParentLectureController extends Controller
{
    public function index()
    {
        $lectures = Lecture::whereHas('invites', function ($query) {
            $query->where('parent_email', auth()->user()->email)->where('is_used', true);
        })->with(['children' => function ($query) {
            $query->where('parent_id', auth()->id());
        }])->get();

        return response()->json(['lectures' => $lectures]);
    }
}
