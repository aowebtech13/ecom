<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('auth/admin/register', [\App\Http\Controllers\AuthController::class, 'registerAdmin']);
    Route::post('auth/admin/login', [\App\Http\Controllers\AuthController::class, 'loginAdmin']);
    Route::post('auth/parent/register', [\App\Http\Controllers\AuthController::class, 'registerParent']);
    Route::post('auth/parent/login', [\App\Http\Controllers\AuthController::class, 'loginParent']);
    Route::post('auth/parent/signup-invite', [\App\Http\Controllers\AuthController::class, 'registerParentViaInvite']);
    Route::post('auth/student/register', [\App\Http\Controllers\AuthController::class, 'registerStudent']);
    Route::post('auth/student/login', [\App\Http\Controllers\AuthController::class, 'loginStudent']);

    Route::get('invites/{token}', [\App\Http\Controllers\LectureInviteController::class, 'show']);

    // Public endpoints
    Route::get('courses/browse', [\App\Http\Controllers\CourseController::class, 'browse']);

    Route::middleware(['auth:api'])->group(function () {
        // Common
        Route::post('auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

        // Admin only
        Route::middleware('role:admin')->group(function () {
            // Lectures (existing)
            Route::get('lectures', [\App\Http\Controllers\LectureController::class, 'index']);
            Route::post('lectures', [\App\Http\Controllers\LectureController::class, 'store']);
            Route::post('lectures/{lecture}/invites', [\App\Http\Controllers\LectureInviteController::class, 'store']);
            Route::get('lectures/{lecture}/invites', [\App\Http\Controllers\LectureInviteController::class, 'index']);

            // Courses
            Route::get('courses', [\App\Http\Controllers\CourseController::class, 'index']);
            Route::post('courses', [\App\Http\Controllers\CourseController::class, 'store']);
            Route::get('courses/{course}', [\App\Http\Controllers\CourseController::class, 'show']);
            Route::put('courses/{course}', [\App\Http\Controllers\CourseController::class, 'update']);
            Route::delete('courses/{course}', [\App\Http\Controllers\CourseController::class, 'destroy']);

            // Assignments
            Route::post('courses/{course}/assignments', [\App\Http\Controllers\AssignmentController::class, 'store']);
            Route::put('assignments/{assignment}', [\App\Http\Controllers\AssignmentController::class, 'update']);
            Route::delete('assignments/{assignment}', [\App\Http\Controllers\AssignmentController::class, 'destroy']);
            Route::get('assignments/{assignment}/submissions', [\App\Http\Controllers\SubmissionController::class, 'assignmentSubmissions']);

            // Grading
            Route::post('submissions/{submission}/grade', [\App\Http\Controllers\GradeController::class, 'store']);
            Route::put('grades/{grade}', [\App\Http\Controllers\GradeController::class, 'update']);
        });

        // Parent only
        Route::middleware('role:parent')->group(function () {
            Route::get('lectures/invited', [\App\Http\Controllers\ParentLectureController::class, 'index']);
            Route::post('lectures/{lecture}/children', [\App\Http\Controllers\ChildController::class, 'store']);
            Route::get('lectures/{lecture}/children', [\App\Http\Controllers\ChildController::class, 'index']);
        });

        // Student only
        Route::middleware('role:student')->group(function () {
            // Dashboard
            Route::get('student/dashboard', [\App\Http\Controllers\StudentController::class, 'dashboard']);
            Route::get('student/profile', [\App\Http\Controllers\StudentController::class, 'profile']);
            Route::get('student/submissions', [\App\Http\Controllers\StudentController::class, 'submissions']);
            Route::get('student/grades', [\App\Http\Controllers\StudentController::class, 'grades']);
            Route::get('student/upcoming-assignments', [\App\Http\Controllers\StudentController::class, 'upcomingAssignments']);
            Route::get('student/assignment-stats', [\App\Http\Controllers\StudentController::class, 'assignmentStats']);
            Route::get('student/course/{course}/progress', [\App\Http\Controllers\StudentController::class, 'courseProgress']);

            // Enrollment
            Route::get('my-courses', [\App\Http\Controllers\CourseController::class, 'myCourses']);
            Route::post('courses/{course}/enroll', [\App\Http\Controllers\EnrollmentController::class, 'store']);
            Route::get('enrollments', [\App\Http\Controllers\EnrollmentController::class, 'userEnrollments']);
            Route::put('enrollments/{enrollment}/progress', [\App\Http\Controllers\EnrollmentController::class, 'updateProgress']);
            Route::put('enrollments/{enrollment}/complete', [\App\Http\Controllers\EnrollmentController::class, 'complete']);

            // Assignments
            Route::get('courses/{course}/assignments', [\App\Http\Controllers\AssignmentController::class, 'courseAssignments']);

            // Submissions
            Route::post('assignments/{assignment}/submit', [\App\Http\Controllers\SubmissionController::class, 'store']);
            Route::get('assignments/{assignment}/my-submission', [\App\Http\Controllers\SubmissionController::class, 'mySubmission']);
            Route::get('submissions/{submission}', [\App\Http\Controllers\SubmissionController::class, 'show']);
            Route::put('submissions/{submission}', [\App\Http\Controllers\SubmissionController::class, 'update']);

            // Grades
            Route::get('submissions/{submission}/grade', [\App\Http\Controllers\GradeController::class, 'show']);
            Route::get('courses/{courseId}/grades', [\App\Http\Controllers\GradeController::class, 'courseGrades']);
        });
    });
});
