<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    // Admin: Get all courses
    public function index()
    {
        $courses = Course::with('instructor')->paginate(10);
        return response()->json($courses);
    }

    // Admin: Create course
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string'],
            'duration_hours' => ['nullable', 'integer'],
            'learning_outcomes' => ['nullable', 'string'],
            'thumbnail_url' => ['nullable', 'url'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = Course::create([
            'instructor_id' => auth('api')->id(),
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category ?? 'General',
            'duration_hours' => $request->duration_hours ?? 0,
            'learning_outcomes' => $request->learning_outcomes,
            'thumbnail_url' => $request->thumbnail_url,
            'status' => 'published',
        ]);

        return response()->json(['message' => 'Course created', 'course' => $course], 201);
    }

    // Get single course
    public function show(Course $course)
    {
        return response()->json($course->load('instructor', 'assignments', 'enrollments'));
    }

    // Admin: Update course
    public function update(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'category' => ['sometimes', 'string'],
            'duration_hours' => ['sometimes', 'integer'],
            'learning_outcomes' => ['sometimes', 'string'],
        ]);

        $course->update($validated);

        return response()->json(['message' => 'Course updated', 'course' => $course]);
    }

    // Admin: Delete course
    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }

    // Student: Browse all published courses
    public function browse()
    {
        $courses = Course::where('status', 'published')
            ->with('instructor')
            ->paginate(10);

        return response()->json($courses);
    }

    // Get my courses (for student)
    public function myCourses()
    {
        $courses = auth('api')->user()->courses()->with('instructor')->paginate(10);
        return response()->json($courses);
    }
}