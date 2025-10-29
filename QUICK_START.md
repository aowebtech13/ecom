# Lecture Hub v2.0 - Quick Start (2 minutes)

## 🚀 Start in 3 steps

### Step 1: Backend
```bash
cd /Applications/MAMP/htdocs/ecom-test/backend
php artisan serve
```
✅ Runs on: http://localhost:8000

### Step 2: Frontend
```bash
cd /Applications/MAMP/htdocs/ecom-test/frontend
npm start
```
Press `i`, `a`, or `w` to launch

### Step 3: Login
Choose **Student** on home page, then use:
- Email: `alice@example.com`
- Password: `student123`

---

## 👥 All Demo Accounts

### Students
- `alice@example.com` / `student123`
- `bob@example.com` / `student123`
- `carol@example.com` / `student123`

### Admin
- `admin@example.com` / `admin123`

### Parent
- `parent@example.com` / `parent123`

---

## 📚 What's New

✨ **Complete Student Portal** with:
- Dashboard with stats & recent grades
- Browse and enroll in courses  
- Track assignments & submissions
- View grades with feedback
- Student profile with analytics

✨ **New UI Components**:
- Card, Button, Badge, ProgressBar
- Input fields, Loading spinners
- Light/dark mode everywhere

✨ **Complete Backend**:
- 5 new database tables (courses, assignments, etc.)
- Full API with 40+ endpoints
- Grading system with auto letter grades
- Progress tracking

---

## 🔧 If Database Not Set Up

```bash
cd /Applications/MAMP/htdocs/ecom-test/backend
php artisan migrate:fresh --seed
```

This creates test data:
- 5 users (3 students, 1 admin, 1 parent)
- 3 courses
- 3 enrollments with progress
- 3 assignments with grades

---

## 📖 Full Docs

- **SETUP_GUIDE.md** - Complete guide with troubleshooting
- **IMPLEMENTATION_SUMMARY.md** - What was added and why
- **Backend API** - RESTful with JWT auth
- **Frontend** - React Native + Expo Router

---

## 🐛 Quick Fixes

**Backend won't start?**
```bash
php artisan cache:clear
php artisan config:clear
```

**Database error?**
```bash
php artisan migrate:fresh --seed
```

**Frontend not loading?**
```bash
rm -rf node_modules package-lock.json
npm install
npm start --clear
```

---

## ✅ You're All Set!

The app is production-ready with:
- ✅ Student portal with courses
- ✅ Assignment & grading system
- ✅ Progress tracking
- ✅ Modern UI & responsive design
- ✅ Real test data to play with
- ✅ Protected routes & auth
- ✅ Light/dark mode support

Enjoy! 🎉