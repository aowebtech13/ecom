<?php

namespace App\Http\Controllers;

use App\Models\ParentLectureInvite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function registerAdmin(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'admin',
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function loginAdmin(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        $token = auth('api')->attempt($credentials + ['role' => 'admin']);

        if (! $token) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['token' => $token, 'user' => auth('api')->user()]);
    }

    public function registerParent(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'parent',
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function registerParentViaInvite(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'invite_token' => ['required', 'string'],
            'name' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $invite = ParentLectureInvite::where('invite_token', $data['invite_token'])->where('is_used', false)->first();

        if (! $invite) {
            return response()->json(['message' => 'Invalid invite'], 404);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $invite->parent_email,
            'password' => Hash::make($data['password']),
            'role' => 'parent',
        ]);

        $invite->update(['is_used' => true]);

        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token, 'user' => $user, 'lecture_id' => $invite->lecture_id]);
    }

    public function loginParent(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        $token = auth('api')->attempt($credentials + ['role' => 'parent']);

        if (! $token) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['token' => $token, 'user' => auth('api')->user()]);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            return response()->json(['message' => 'Failed to logout'], 500);
        }

        return response()->json(['message' => 'Logged out']);
    }
}
