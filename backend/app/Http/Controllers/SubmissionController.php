<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubmissionController extends Controller
{
    // Student: Submit assignment
    public function store(Request $request, Assignment $assignment)
    {
        $validator = Validator::make($request->all(), [
            'content' => ['nullable', 'string'],
            'file_url' => ['nullable', 'url'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = auth('api')->id();

        // Check if already submitted
        $existing = Submission::where('assignment_id', $assignment->id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already submitted this assignment'], 409);
        }

        $isLate = now()->isAfter($assignment->due_date);

        $submission = Submission::create([
            'assignment_id' => $assignment->id,
            'user_id' => $userId,
            'content' => $request->content,
            'file_url' => $request->file_url,
            'status' => $isLate ? 'late' : 'submitted',
        ]);

        $assignment->increment('submission_count');

        return response()->json([
            'message' => $isLate ? 'Submitted late' : 'Submitted successfully',
            'submission' => $submission
        ], 201);
    }

    // Get my submission for an assignment
    public function mySubmission(Assignment $assignment)
    {
        $submission = Submission::where('assignment_id', $assignment->id)
            ->where('user_id', auth('api')->id())
            ->with('grade')
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'No submission found'], 404);
        }

        return response()->json($submission);
    }

    // Get all submissions for an assignment (admin)
    public function assignmentSubmissions(Assignment $assignment)
    {
        $submissions = $assignment->submissions()->with(['user', 'grade'])->get();
        return response()->json($submissions);
    }

    // Get submission details
    public function show(Submission $submission)
    {
        return response()->json($submission->load('user', 'assignment', 'grade'));
    }

    // Update submission
    public function update(Request $request, Submission $submission)
    {
        // Only student can update their own submission before grading
        if ($submission->user_id !== auth('api')->id() || $submission->status === 'graded') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $submission->update([
            'content' => $request->content ?? $submission->content,
            'file_url' => $request->file_url ?? $submission->file_url,
        ]);

        return response()->json(['message' => 'Submission updated', 'submission' => $submission]);
    }
}