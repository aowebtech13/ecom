<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssignmentController extends Controller
{
    // Get assignments for a course
    public function index(Course $course)
    {
        $assignments = $course->assignments()->with('submissions')->get();
        return response()->json($assignments);
    }

    // Create assignment (admin only)
    public function store(Request $request, Course $course)
    {
        $this->authorize('create', [Assignment::class, $course]);

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string'],
            'description' => ['required', 'string'],
            'instructions' => ['nullable', 'string'],
            'max_points' => ['nullable', 'integer'],
            'due_date' => ['required', 'date'],
            'type' => ['required', 'in:quiz,assignment,project,discussion'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $assignment = Assignment::create([
            'course_id' => $course->id,
            'title' => $request->title,
            'description' => $request->description,
            'instructions' => $request->instructions,
            'max_points' => $request->max_points ?? 100,
            'due_date' => $request->due_date,
            'type' => $request->type,
        ]);

        return response()->json(['message' => 'Assignment created', 'assignment' => $assignment], 201);
    }

    // Get single assignment
    public function show(Assignment $assignment)
    {
        return response()->json($assignment->load('course', 'submissions.user'));
    }

    // Update assignment
    public function update(Request $request, Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        $validated = $request->validate([
            'title' => ['sometimes', 'string'],
            'description' => ['sometimes', 'string'],
            'due_date' => ['sometimes', 'date'],
            'max_points' => ['sometimes', 'integer'],
        ]);

        $assignment->update($validated);

        return response()->json(['message' => 'Assignment updated', 'assignment' => $assignment]);
    }

    // Delete assignment
    public function destroy(Assignment $assignment)
    {
        $this->authorize('delete', $assignment);
        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted']);
    }

    // Get assignments for student in a course
    public function courseAssignments(Course $course)
    {
        $assignments = $course->assignments()
            ->with(['submissions' => function ($query) {
                $query->where('user_id', auth('api')->id());
            }])
            ->get();

        return response()->json($assignments);
    }
}