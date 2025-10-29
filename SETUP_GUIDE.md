# Lecture Hub - Complete Setup Guide

A comprehensive e-learning platform with role-based access for students, administrators, and parents.

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.1+
- Node.js 16+
- npm or yarn
- SQLite (included with Laravel)
- Expo CLI: `npm install -g expo-cli`

### 1. Database Setup

```bash
cd /Applications/MAMP/htdocs/ecom-test/backend

# Install dependencies
composer install

# Run migrations and seeders
php artisan migrate:fresh --seed
```

This creates test data with 3 courses, multiple students, assignments, and grades.

### 2. Start Backend Server

```bash
cd /Applications/MAMP/htdocs/ecom-test/backend
php artisan serve
```

**Backend runs on:** `http://localhost:8000`

### 3. Start Frontend

```bash
cd /Applications/MAMP/htdocs/ecom-test/frontend
npm install  # if not already done
npm start
```

Then choose:
- `i` for iOS Simulator
- `a` for Android Emulator  
- `w` for Web Browser

---

## 👥 Login Credentials

### Students
| Email | Password | Role |
|-------|----------|------|
| `alice@example.com` | `student123` | Student |
| `bob@example.com` | `student123` | Student |
| `carol@example.com` | `student123` | Student |

### Administrator
| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `admin123` | Admin |

### Parent
| Email | Password | Role |
|-------|----------|------|
| `parent@example.com` | `parent123` | Parent |

---

## 📚 Features by Role

### 👨‍🎓 Student
- **Dashboard**: View enrolled courses, stats, and recent grades
- **Browse Courses**: Explore and enroll in available courses
- **Course Details**: View course information, assignments, learning outcomes
- **Assignments**: Track submitted assignments and grades
- **My Profile**: View account info and assignment statistics

### 🛡️ Administrator  
- **Dashboard**: Manage all courses and lectures
- **Create Courses**: Add new courses with descriptions and learning outcomes
- **Manage Assignments**: Create and manage assignments for courses
- **Grade Submissions**: Review and grade student submissions
- **View Analytics**: See enrollment counts and course ratings

### 👨‍👩‍👧 Parent
- **Dashboard**: View invited lectures and children's enrollments
- **Child Management**: Manage children enrolled in courses
- **Progress Tracking**: Monitor children's course progress

---

## 🗄️ Database Schema

### Core Tables
- **users** - All user accounts with role-based access
- **courses** - Course information and metadata
- **enrollments** - Student enrollment records with progress tracking
- **assignments** - Course assignments (quiz, assignment, project, discussion)
- **submissions** - Student assignment submissions
- **grades** - Graded submissions with scores and feedback

### Relationships
```
User → Courses (1-to-many)
User → Enrollments (1-to-many)
Enrollments → Courses (many-to-many)
Courses → Assignments (1-to-many)
Assignments → Submissions (1-to-many)
Submissions → Grades (1-to-1)
```

---

## 🔌 API Endpoints

### Authentication
```
POST /v1/auth/student/login
POST /v1/auth/student/register
POST /v1/auth/admin/login
POST /v1/auth/parent/login
POST /v1/auth/logout
```

### Courses (Student)
```
GET  /v1/courses/browse              # Browse all courses
GET  /v1/my-courses                  # Get enrolled courses
POST /v1/courses/{id}/enroll         # Enroll in course
GET  /v1/courses/{id}/assignments    # Get course assignments
```

### Courses (Admin)
```
GET    /v1/courses                   # List all courses
POST   /v1/courses                   # Create course
GET    /v1/courses/{id}              # Get course details
PUT    /v1/courses/{id}              # Update course
DELETE /v1/courses/{id}              # Delete course
```

### Assignments
```
POST   /v1/courses/{id}/assignments           # Create assignment
PUT    /v1/assignments/{id}                   # Update assignment
DELETE /v1/assignments/{id}                   # Delete assignment
POST   /v1/assignments/{id}/submit            # Submit assignment
GET    /v1/assignments/{id}/my-submission     # Get my submission
```

### Grading
```
POST /v1/submissions/{id}/grade     # Grade a submission
PUT  /v1/grades/{id}                # Update grade
GET  /v1/submissions/{id}/grade     # Get grade
```

### Dashboard & Stats
```
GET /v1/student/dashboard           # Student dashboard data
GET /v1/student/submissions         # View all submissions
GET /v1/student/grades              # View all grades
GET /v1/student/assignment-stats    # Get assignment statistics
```

---

## 🎨 UI Components

New custom components available:
- **Card** - Elevated container with borders
- **Button** - Multiple variants (primary, secondary, outline, danger)
- **Badge** - Status indicators with variants
- **ProgressBar** - Visual progress indicators
- **Input** - Text input fields with labels and validation
- **Spinner** - Loading indicators

### Example Usage
```tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

<Card>
  <Badge label="Active" variant="success" />
  <Button onPress={handleClick}>Click Me</Button>
</Card>
```

---

## 🌗 Theme System

All components support light/dark mode via `useColorScheme()` hook.

```tsx
import { getPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme();
const palette = getPalette(colorScheme ?? 'light');

// Use palette.primary, palette.text, palette.muted, etc.
```

---

## 📁 Project Structure

```
/frontend
  ├── app/
  │   ├── student/        # Student module
  │   ├── admin/          # Admin module
  │   ├── parent/         # Parent module
  │   └── (tabs)/         # Tab navigation pages
  ├── components/
  │   ├── ui/             # Reusable UI components
  │   └── forms/          # Form components
  ├── services/
  │   └── api.ts          # API client
  ├── store/
  │   └── useAuthStore.ts # Auth state management
  └── constants/
      └── theme.ts        # Color palette

/backend
  ├── app/
  │   ├── Models/         # Database models
  │   ├── Http/
  │   │   └── Controllers/ # API controllers
  │   └── Providers/      # Service providers
  ├── database/
  │   ├── migrations/     # Database migrations
  │   └── seeders/        # Test data
  ├── routes/
  │   └── api.php         # API routes
  └── config/             # Configuration files
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear Laravel cache
php artisan cache:clear
php artisan config:clear

# Regenerate app key
php artisan key:generate

# Check database
php artisan migrate:fresh --seed
```

### Frontend not loading
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
expo start --clear
```

### Migration errors
```bash
# Roll back migrations
php artisan migrate:rollback

# Fresh migration
php artisan migrate:fresh --seed
```

### API not responding
- Check backend is running: `http://localhost:8000`
- Verify `.env` file has correct APP_URL
- Check `services/api.ts` has correct base URL

---

## 📊 Test Data Overview

After seeding:
- **3 Courses** created by admin
- **3 Students** with various enrollments
- **5 Assignments** across courses
- **4 Submissions** with grades
- Sample grades ranging from B to A

---

## 🔐 Security Features

- JWT authentication with token-based authorization
- Role-based access control (RBAC)
- Protected routes for authenticated users
- Input validation on frontend and backend
- Password hashing with bcrypt

---

## 🚀 Deployment

### Backend (Laravel)
```bash
# Production build
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Use environment file
cp .env.example .env
# Update APP_URL, database config, etc.
```

### Frontend (Expo)
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for web
npm run build
```

---

## 📞 Support & Documentation

- **Laravel Docs**: https://laravel.com/docs
- **React Native Docs**: https://reactnative.dev
- **Expo Docs**: https://docs.expo.dev
- **JWT Auth**: https://github.com/tymondesigns/jwt-auth

---

## ✨ Recent Updates

### v2.0 (Current)
- ✅ Added Student role with complete dashboard
- ✅ Created Course management system
- ✅ Assignment and submission tracking
- ✅ Grading system with automatic letter grades
- ✅ New UI components (Card, Button, Badge, ProgressBar)
- ✅ Enhanced theme system with Palette interface
- ✅ Comprehensive API endpoints

### v1.0 (Initial)
- Admin and Parent roles
- Lecture management
- Parent-child relationships

---

**Last Updated:** January 2025  
**Status:** Production Ready ✅