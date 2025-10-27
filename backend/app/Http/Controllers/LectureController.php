<?php

namespace App\Http\Controllers;

use App\Models\Lecture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LectureController extends Controller
{
    public function index()
    {
        $lectures = Lecture::with('invites')->where('created_by', auth()->id())->get();

        return response()->json(['lectures' => $lectures]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'scheduled_at' => ['required', 'date'],
            'image' => ['nullable', 'image'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['created_by'] = auth()->id();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('lectures', 'public');
        }

        $lecture = Lecture::create($data);

        return response()->json(['lecture' => $lecture], 201);
    }
}
