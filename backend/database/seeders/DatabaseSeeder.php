<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);

        // Parent User
        User::create([
            'name' => 'John Parent',
            'email' => 'parent@example.com',
            'password' => bcrypt('parent123'),
            'role' => 'parent',
        ]);

        // Students
        $student1 = User::create([
            'name' => 'Alice Johnson',
            'email' => 'alice@example.com',
            'password' => bcrypt('student123'),
            'role' => 'student',
        ]);

        $student2 = User::create([
            'name' => 'Bob Smith',
            'email' => 'bob@example.com',
            'password' => bcrypt('student123'),
            'role' => 'student',
        ]);

        $student3 = User::create([
            'name' => 'Carol Williams',
            'email' => 'carol@example.com',
            'password' => bcrypt('student123'),
            'role' => 'student',
        ]);

        // Courses
        $course1 = Course::create([
            'instructor_id' => $admin->id,
            'title' => 'Introduction to Web Development',
            'description' => 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
            'category' => 'Web Development',
            'duration_hours' => 40,
            'learning_outcomes' => 'Build responsive websites, understand web standards',
            'status' => 'published',
            'enrollment_count' => 2,
            'rating' => 4.5,
        ]);

        $course2 = Course::create([
            'instructor_id' => $admin->id,
            'title' => 'Advanced JavaScript Concepts',
            'description' => 'Master advanced JavaScript patterns and best practices.',
            'category' => 'Programming',
            'duration_hours' => 35,
            'learning_outcomes' => 'Advanced JS patterns, async programming, modules',
            'status' => 'published',
            'enrollment_count' => 1,
            'rating' => 4.8,
        ]);

        $course3 = Course::create([
            'instructor_id' => $admin->id,
            'title' => 'Database Design & SQL',
            'description' => 'Learn database design principles and SQL querying.',
            'category' => 'Database',
            'duration_hours' => 30,
            'learning_outcomes' => 'Database design, SQL queries, optimization',
            'status' => 'published',
            'enrollment_count' => 0,
            'rating' => 0,
        ]);

        // Enrollments
        $enrollment1 = Enrollment::create([
            'user_id' => $student1->id,
            'course_id' => $course1->id,
            'status' => 'active',
            'progress_percentage' => 65,
        ]);

        $enrollment2 = Enrollment::create([
            'user_id' => $student2->id,
            'course_id' => $course1->id,
            'status' => 'active',
            'progress_percentage' => 40,
        ]);

        $enrollment3 = Enrollment::create([
            'user_id' => $student1->id,
            'course_id' => $course2->id,
            'status' => 'completed',
            'progress_percentage' => 100,
            'completed_at' => now()->subDays(5),
        ]);

        // Assignments for Course 1
        $assignment1 = Assignment::create([
            'course_id' => $course1->id,
            'title' => 'Build Your First Website',
            'description' => 'Create a personal website using HTML and CSS.',
            'instructions' => 'Use semantic HTML, responsive design, and CSS flexbox.',
            'max_points' => 100,
            'due_date' => now()->addDays(7),
            'type' => 'assignment',
            'submission_count' => 2,
        ]);

        $assignment2 = Assignment::create([
            'course_id' => $course1->id,
            'title' => 'JavaScript Quiz',
            'description' => 'Test your understanding of JavaScript fundamentals.',
            'max_points' => 50,
            'due_date' => now()->addDays(3),
            'type' => 'quiz',
            'submission_count' => 1,
        ]);

        // Assignments for Course 2
        $assignment3 = Assignment::create([
            'course_id' => $course2->id,
            'title' => 'Async Programming Project',
            'description' => 'Build an application using async/await.',
            'instructions' => 'Create a weather app using async API calls.',
            'max_points' => 100,
            'due_date' => now()->subDays(5),
            'type' => 'project',
            'submission_count' => 1,
        ]);

        // Submissions for Student 1
        $submission1 = Submission::create([
            'assignment_id' => $assignment1->id,
            'user_id' => $student1->id,
            'content' => 'Built a responsive portfolio website',
            'status' => 'graded',
        ]);

        $submission2 = Submission::create([
            'assignment_id' => $assignment2->id,
            'user_id' => $student1->id,
            'content' => 'Quiz answers submitted',
            'status' => 'graded',
        ]);

        $submission3 = Submission::create([
            'assignment_id' => $assignment3->id,
            'user_id' => $student1->id,
            'content' => 'Weather app built with React',
            'status' => 'graded',
        ]);

        // Submissions for Student 2
        $submission4 = Submission::create([
            'assignment_id' => $assignment1->id,
            'user_id' => $student2->id,
            'content' => 'Personal blog website',
            'status' => 'submitted',
        ]);

        // Grades
        Grade::create([
            'submission_id' => $submission1->id,
            'graded_by' => $admin->id,
            'score' => 92,
            'feedback' => 'Excellent work! Great use of CSS Grid and Flexbox.',
            'grade_letter' => 'A',
        ]);

        Grade::create([
            'submission_id' => $submission2->id,
            'graded_by' => $admin->id,
            'score' => 45,
            'feedback' => 'Good effort. Review the async/await concepts.',
            'grade_letter' => 'B',
        ]);

        Grade::create([
            'submission_id' => $submission3->id,
            'graded_by' => $admin->id,
            'score' => 88,
            'feedback' => 'Well-structured code with good error handling.',
            'grade_letter' => 'A',
        ]);
    }
}
