<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    // Student: Enroll in course
    public function store(Request $request, Course $course)
    {
        $userId = auth('api')->id();

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already enrolled in this course'], 409);
        }

        $enrollment = Enrollment::create([
            'user_id' => $userId,
            'course_id' => $course->id,
            'status' => 'active',
            'progress_percentage' => 0,
        ]);

        $course->increment('enrollment_count');

        return response()->json(['message' => 'Enrolled successfully', 'enrollment' => $enrollment], 201);
    }

    // Get enrollment details
    public function show(Enrollment $enrollment)
    {
        return response()->json($enrollment->load('course', 'user'));
    }

    // Update progress
    public function updateProgress(Request $request, Enrollment $enrollment)
    {
        $this->authorize('update', $enrollment);

        $enrollment->update([
            'progress_percentage' => $request->progress_percentage,
        ]);

        return response()->json(['message' => 'Progress updated', 'enrollment' => $enrollment]);
    }

    // Complete course
    public function complete(Enrollment $enrollment)
    {
        $this->authorize('update', $enrollment);

        $enrollment->update([
            'status' => 'completed',
            'completed_at' => now(),
            'progress_percentage' => 100,
        ]);

        return response()->json(['message' => 'Course completed', 'enrollment' => $enrollment]);
    }

    // Get student enrollments
    public function userEnrollments()
    {
        $enrollments = Enrollment::where('user_id', auth('api')->id())
            ->with('course.instructor')
            ->get();

        return response()->json($enrollments);
    }
}