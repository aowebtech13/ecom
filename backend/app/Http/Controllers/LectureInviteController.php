<?php

namespace App\Http\Controllers;

use App\Models\Lecture;
use App\Models\ParentLectureInvite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Str;
use Illuminate\Support\Facades\Validator;

class LectureInviteController extends Controller
{
    public function index(Lecture $lecture)
    {
        $this->authorizeLecture($lecture);

        return response()->json(['invites' => $lecture->invites]);
    }

    public function store(Request $request, Lecture $lecture)
    {
        $this->authorizeLecture($lecture);

        $validator = Validator::make($request->all(), [
            'parent_email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $invite = ParentLectureInvite::updateOrCreate(
            [
                'lecture_id' => $lecture->id,
                'parent_email' => $request->parent_email,
            ],
            [
                'invite_token' => Str::uuid(),
                'is_used' => false,
            ]
        );

        return response()->json(['invite' => $invite], 201);
    }

    public function show(string $token)
    {
        $invite = ParentLectureInvite::with('lecture')->where('invite_token', $token)->first();

        if (! $invite) {
            return response()->json(['message' => 'Invite not found'], 404);
        }

        return response()->json([
            'invite' => $invite,
            'lecture' => $invite->lecture,
        ]);
    }

    protected function authorizeLecture(Lecture $lecture)
    {
        abort_if($lecture->created_by !== auth()->id(), 403, 'Unauthorized');
    }
}
