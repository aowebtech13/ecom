<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GradeController extends Controller
{
    // Admin: Grade a submission
    public function store(Request $request, Submission $submission)
    {
        $this->authorize('create', Grade::class);

        $validator = Validator::make($request->all(), [
            'score' => ['required', 'integer', 'min:0'],
            'feedback' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $score = $request->score;
        $max_points = $submission->assignment->max_points;
        $percentage = ($score / $max_points) * 100;

        // Calculate letter grade
        $letterGrade = match (true) {
            $percentage >= 90 => 'A',
            $percentage >= 80 => 'B',
            $percentage >= 70 => 'C',
            $percentage >= 60 => 'D',
            default => 'F',
        };

        $grade = Grade::create([
            'submission_id' => $submission->id,
            'graded_by' => auth('api')->id(),
            'score' => $score,
            'feedback' => $request->feedback,
            'grade_letter' => $letterGrade,
        ]);

        $submission->update(['status' => 'graded']);

        return response()->json(['message' => 'Grade recorded', 'grade' => $grade], 201);
    }

    // Get grade for submission
    public function show(Submission $submission)
    {
        $grade = $submission->grade;

        if (!$grade) {
            return response()->json(['message' => 'Not graded yet'], 404);
        }

        return response()->json($grade);
    }

    // Update grade
    public function update(Request $request, Grade $grade)
    {
        $this->authorize('update', $grade);

        $grade->update([
            'score' => $request->score ?? $grade->score,
            'feedback' => $request->feedback ?? $grade->feedback,
        ]);

        // Recalculate letter grade
        $percentage = ($grade->score / $grade->submission->assignment->max_points) * 100;
        $letterGrade = match (true) {
            $percentage >= 90 => 'A',
            $percentage >= 80 => 'B',
            $percentage >= 70 => 'C',
            $percentage >= 60 => 'D',
            default => 'F',
        };

        $grade->update(['grade_letter' => $letterGrade]);

        return response()->json(['message' => 'Grade updated', 'grade' => $grade]);
    }

    // Get student grades for a course
    public function courseGrades(Request $request, $courseId)
    {
        $studentId = $request->query('student_id') ?? auth('api')->id();

        $grades = Grade::whereHas('submission', function ($query) use ($courseId, $studentId) {
            $query->whereHas('assignment', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            })->where('user_id', $studentId);
        })->with('submission.assignment')->get();

        return response()->json($grades);
    }
}