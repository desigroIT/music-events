# Admin Dashboard Guide

## Access URL
```
http://localhost:3000/admin92-studio-musicians
```

## Features

### 🎯 Dashboard Overview
- **Dark neon theme** matching the main website
- **Left sidebar** with 7 main sections
- **Right panel** showing section-specific content
- **Responsive design** for mobile and desktop

### 📚 Courses Management
The Courses panel allows you to:
- ✅ Create new drum courses
- ✅ Edit existing courses
- ✅ Delete courses
- ✅ Search courses by title, instructor, or tags
- ✅ Real-time sync with Firebase Firestore

#### Course Form Fields:
- **Title** - Course name
- **Instructor** - Teacher's name
- **Level** - Beginner | Intermediate | Advanced | All Levels
- **Duration** - e.g., "8 weeks"
- **Lessons** - Number of lessons
- **Students** - Number of enrolled students
- **Rating** - 0 to 5 stars
- **Price** - Course price in USD
- **Badge** - Label like "Bestseller", "New", "Premium"
- **Badge Color** - Visual badge color
- **Tags** - Multiple tags (e.g., "Jazz", "Technique")
- **Description** - Course description

### 🔄 Firebase Integration

#### Collections Structure:
```
firestore/
  └── courses/
      ├── {courseId}/
      │   ├── title
      │   ├── instructor
      │   ├── level
      │   ├── duration
      │   ├── lessons
      │   ├── students
      │   ├── rating
      │   ├── price
      │   ├── badge
      │   ├── badgeColor
      │   ├── tags[]
      │   ├── description
      │   ├── createdAt
      │   └── updatedAt
```

#### Initial Setup:
1. Visit the admin dashboard
2. If no courses exist, you'll see a "Sync Dummy Data" button
3. Click it to import all courses from `dummy.ts` to Firebase
4. Once synced, the main website will show Firebase data

### 🌐 Website Integration
The main website's Courses section automatically:
- Fetches data from Firebase on load
- Falls back to dummy data if Firebase is empty
- Shows loading spinner while fetching
- Updates in real-time when admin makes changes

## Coming Soon
- Academy Panel
- Community Panel
- Networking Panel
- Blog Panel
- Events Panel
- Membership Panel

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Firebase Firestore
- **UI**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React

## Security Notes
- ⚠️ This is a basic admin panel without authentication
- ⚠️ Add authentication before deploying to production
- ⚠️ Consider Firebase Security Rules for production use

## Development

### Start Dev Server:
```bash
npm run dev
```

### Environment Variables:
See `.env.local` for Firebase configuration

### Firestore Functions:
Located in `src/lib/firestore.ts`:
- `getCourses()` - Fetch all courses
- `getCourseById(id)` - Fetch single course
- `createCourse(data)` - Create new course
- `updateCourse(id, data)` - Update course
- `deleteCourse(id)` - Delete course
- `syncDummyDataToFirestore(courses)` - Bulk import

## Design System
- **Primary Orange**: #FF5B00
- **Cyan**: #00D4FF
- **Purple**: #9D4EDD
- **Yellow**: #FFD60A
- **Success**: #00FF85
- **Background**: #0A0A0A
- **Cards**: rgba(255, 255, 255, 0.05)

## Support
For issues or questions, refer to the main project documentation.
