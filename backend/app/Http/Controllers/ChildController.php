<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\Lecture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChildController extends Controller
{
    public function index(Lecture $lecture)
    {
        $this->authorizeLecture($lecture);

        $children = Child::where('lecture_id', $lecture->id)->where('parent_id', auth()->id())->get();

        return response()->json(['children' => $children]);
    }

    public function store(Request $request, Lecture $lecture)
    {
        $this->authorizeLecture($lecture);

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string'],
            'age' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $child = Child::create([
            'lecture_id' => $lecture->id,
            'parent_id' => auth()->id(),
            'name' => $request->name,
            'age' => $request->age,
        ]);

        return response()->json(['child' => $child], 201);
    }

    protected function authorizeLecture(Lecture $lecture)
    {
        $hasInvite = $lecture->invites()->where('parent_email', auth()->user()->email)->where('is_used', true)->exists();

        abort_if(! $hasInvite, 403, 'Unauthorized');
    }
}
