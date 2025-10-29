<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Submission;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // Get student dashboard data
    public function dashboard()
    {
        $user = auth('api')->user();

        $enrolledCourses = $user->enrollments()->count();
        $completedCourses = $user->enrollments()->where('status', 'completed')->count();
        $pendingAssignments = Submission::whereHas('assignment', function ($query) {
            $query->whereRaw('due_date > NOW()');
        })->where('user_id', $user->id)
            ->whereDoesntHave('grade')
            ->count();

        $recentGrades = Grade::whereHas('submission', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->latest()->take(5)->with('submission.assignment')->get();

        return response()->json([
            'user' => $user,
            'stats' => [
                'enrolled_courses' => $enrolledCourses,
                'completed_courses' => $completedCourses,
                'pending_assignments' => $pendingAssignments,
            ],
            'recent_grades' => $recentGrades,
        ]);
    }

    // Get student profile
    public function profile()
    {
        return response()->json(auth('api')->user());
    }

    // Get student's course progress
    public function courseProgress($courseId)
    {
        $user = auth('api')->user();

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'Not enrolled in this course'], 404);
        }

        $assignments = $enrollment->course->assignments()
            ->with(['submissions' => function ($query) use ($user) {
                $query->where('user_id', $user->id)->with('grade');
            }])->get();

        $avgGrade = Grade::whereHas('submission', function ($query) use ($user, $courseId) {
            $query->where('user_id', $user->id)
                ->whereHas('assignment', function ($q) use ($courseId) {
                    $q->where('course_id', $courseId);
                });
        })->avg('score');

        return response()->json([
            'enrollment' => $enrollment,
            'assignments' => $assignments,
            'average_grade' => round($avgGrade, 2),
        ]);
    }

    // Get student's submissions
    public function submissions()
    {
        $submissions = Submission::where('user_id', auth('api')->id())
            ->with(['assignment.course', 'grade'])
            ->latest()
            ->paginate(10);

        return response()->json($submissions);
    }

    // Get student's grades
    public function grades()
    {
        $grades = Grade::whereHas('submission', function ($query) {
            $query->where('user_id', auth('api')->id());
        })->with('submission.assignment')->latest()->paginate(10);

        return response()->json($grades);
    }

    // Get upcoming assignments
    public function upcomingAssignments()
    {
        $user = auth('api')->user();

        $assignments = $user->courses()
            ->with(['assignments' => function ($query) {
                $query->where('due_date', '>', now())
                    ->orderBy('due_date')
                    ->limit(10);
            }])->get()
            ->flatMap->assignments;

        return response()->json($assignments);
    }

    // Get assignment statistics
    public function assignmentStats()
    {
        $user = auth('api')->user();

        $stats = [
            'total_submitted' => Submission::where('user_id', $user->id)->count(),
            'graded' => Submission::where('user_id', $user->id)->where('status', 'graded')->count(),
            'pending_grade' => Submission::where('user_id', $user->id)
                ->where('status', 'submitted')
                ->whereDoesntHave('grade')
                ->count(),
            'late_submissions' => Submission::where('user_id', $user->id)->where('status', 'late')->count(),
            'average_grade' => Grade::whereHas('submission', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->avg('score'),
        ];

        return response()->json($stats);
    }
}