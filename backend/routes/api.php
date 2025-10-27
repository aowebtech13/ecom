<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // authentication
    Route::post('auth/admin/register', [\App\Http\Controllers\AuthController::class, 'registerAdmin']);
    Route::post('auth/admin/login', [\App\Http\Controllers\AuthController::class, 'loginAdmin']);
    Route::post('auth/parent/register', [\App\Http\Controllers\AuthController::class, 'registerParent']);
    Route::post('auth/parent/login', [\App\Http\Controllers\AuthController::class, 'loginParent']);
    Route::post('auth/parent/signup-invite', [\App\Http\Controllers\AuthController::class, 'registerParentViaInvite']);

    Route::get('invites/{token}', [\App\Http\Controllers\LectureInviteController::class, 'show']);

    Route::middleware(['auth:api'])->group(function () {
        Route::middleware('role:admin')->group(function () {
            Route::get('lectures', [\App\Http\Controllers\LectureController::class, 'index']);
            Route::post('lectures', [\App\Http\Controllers\LectureController::class, 'store']);
            Route::post('lectures/{lecture}/invites', [\App\Http\Controllers\LectureInviteController::class, 'store']);
            Route::get('lectures/{lecture}/invites', [\App\Http\Controllers\LectureInviteController::class, 'index']);
        });

        Route::middleware('role:parent')->group(function () {
            Route::get('lectures/invited', [\App\Http\Controllers\ParentLectureController::class, 'index']);
            Route::post('lectures/{lecture}/children', [\App\Http\Controllers\ChildController::class, 'store']);
            Route::get('lectures/{lecture}/children', [\App\Http\Controllers\ChildController::class, 'index']);
        });

        Route::post('auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    });
});
