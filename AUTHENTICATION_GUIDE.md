# 🔐 Studio Musicians - Authentication System Guide

## 🎯 Overview

This guide provides a complete implementation of Firebase Authentication for the Studio Musicians platform, featuring a premium neon-themed UI that matches your design aesthetic.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Files Created](#files-created)
3. [Setup Instructions](#setup-instructions)
4. [Usage Examples](#usage-examples)
5. [Styling Guide](#styling-guide)
6. [Testing Checklist](#testing-checklist)

---

## 🏗️ Architecture Overview

### Authentication Flow

```
User clicks "Enroll Now" 
    ↓
Not Authenticated?
    ↓ YES
Redirect to /?auth=true&redirect=/course/{id}
    ↓
AuthModal opens automatically
    ↓
User registers/logs in
    ↓
Redirect to /course/{id}
    ↓
AuthGuard validates authentication
    ↓
Course page loads
```

### Components Structure

```
src/
├── lib/
│   ├── auth.ts                    # Firebase Auth functions
│   └── firestore.ts               # Firestore CRUD operations
├── contexts/
│   └── AuthContext.tsx            # Global auth state
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx          # Login/Register UI
│   │   └── AuthGuard.tsx          # Route protection
│   └── ui/
│       └── EnrollButton.tsx       # Smart enrollment button
├── hooks/
│   └── useAuthModal.ts            # Auth modal state management
└── app/
    ├── layout.tsx                 # AuthProvider wrapper
    ├── page.tsx                   # Home with auth modal
    └── course/[id]/page.tsx       # Protected course page
```

---

## 📁 Files Created

### 1. **Authentication Library** (`src/lib/auth.ts`)

Core Firebase Auth functions:
- `registerUser()` - Register with email/password + profile data
- `loginUser()` - Sign in existing users
- `logoutUser()` - Sign out
- `getUserProfile()` - Fetch user data from Firestore
- `updateUserProfile()` - Update user data
- `subscribeToAuthState()` - Listen to auth changes

### 2. **Auth Context** (`src/contexts/AuthContext.tsx`)

Global state provider:
- `user` - Firebase User object
- `userProfile` - User profile from Firestore
- `loading` - Auth initialization state
- `isAuthenticated` - Boolean auth status

### 3. **Auth Modal** (`src/components/auth/AuthModal.tsx`)

Premium neon-themed login/register UI:
- **Required fields**: Email, Password, Confirm Password (register), Display Name (register)
- **Optional fields**: District, Age, Phone, School/University
- Animated neon background effects
- Form validation
- Password visibility toggle
- Error handling

### 4. **Auth Guard** (`src/components/auth/AuthGuard.tsx`)

Route protection wrapper:
- Checks authentication status
- Redirects to home with auth modal if not authenticated
- Preserves intended destination URL
- Loading state management

### 5. **Enroll Button** (`src/components/ui/EnrollButton.tsx`)

Smart button component:
- Checks auth status before navigation
- Redirects to auth modal if not authenticated
- Navigates to course page if authenticated
- Customizable styling

### 6. **Auth Modal Hook** (`src/hooks/useAuthModal.ts`)

Modal state management:
- Auto-opens modal from URL params (`?auth=true`)
- Manages redirect URLs
- Cleans up URL after modal closes

### 7. **Course Detail Page** (`src/app/course/[id]/page.tsx`)

Example protected route:
- Wrapped in `<AuthGuard>`
- Displays course details
- Shows user profile in header
- Lesson curriculum with locked/unlocked states

---

## 🚀 Setup Instructions

### Step 1: Environment Variables

Ensure your `.env.local` file contains Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 2: Firebase Console Setup

1. Enable **Authentication** → **Email/Password** provider
2. Enable **Firestore Database**
3. Create collection: `users`
4. (Optional) Set Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Courses are public read, admin write
    match /courses/{courseId} {
      allow read: if true;
      allow write: if false; // Set to admin-only later
    }
  }
}
```

### Step 3: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
```

---

## 💻 Usage Examples

### Example 1: Protecting a Route

```tsx
import AuthGuard from "@/components/auth/AuthGuard";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Your protected content here</div>
    </AuthGuard>
  );
}
```

### Example 2: Using the EnrollButton

```tsx
import EnrollButton from "@/components/ui/EnrollButton";

export default function CourseCard({ course }) {
  return (
    <div>
      <h3>{course.title}</h3>
      <EnrollButton courseId={course.id} />
    </div>
  );
}
```

### Example 3: Accessing Auth State

```tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function UserProfile() {
  const { user, userProfile, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h2>Welcome, {userProfile?.displayName || user?.email}</h2>
      <p>District: {userProfile?.district}</p>
    </div>
  );
}
```

### Example 4: Manual Login/Register

```tsx
import { registerUser, loginUser } from "@/lib/auth";

// Register
const result = await registerUser(
  "user@example.com",
  "password123",
  "John Doe",
  {
    district: "Colombo",
    age: 25,
    phone: "+94712345678",
    schoolOrUniversity: "University of Sri Lanka"
  }
);

if (result.success) {
  console.log("Registered:", result.user);
}

// Login
const loginResult = await loginUser("user@example.com", "password123");
if (loginResult.success) {
  console.log("Logged in:", loginResult.user);
}
```

---

## 🎨 Styling Guide

### Neon Color Palette

```css
--neon-orange: #FF4500
--neon-purple: #BF00FF
--orange-gradient: linear-gradient(to right, #FF4500, #FF8C00)
--purple-gradient: linear-gradient(to right, #BF00FF, #9D4EDD)
```

### Neon Glow Effects

Already added to `globals.css`:

```css
@keyframes glow {
  from { filter: drop-shadow(0 0 5px #FF4500); }
  to { filter: drop-shadow(0 0 20px #FF4500); }
}

.neon-glow {
  animation: glow 2s infinite alternate;
}
```

### Input Focus Effect

```tsx
<input
  className="focus:border-[#FF4500]/50 focus:shadow-[0_0_15px_rgba(255,69,0,0.1)]"
/>
```

### Button Styling

```tsx
<button className="bg-gradient-to-r from-[#FF4500] to-[#FF8C00] hover:shadow-2xl hover:shadow-[#FF4500]/30">
  Click Me
</button>
```

---

## ✅ Testing Checklist

### Functional Tests

- [ ] User can register with required fields
- [ ] User can register with optional fields
- [ ] Password confirmation validation works
- [ ] Login with correct credentials succeeds
- [ ] Login with incorrect credentials shows error
- [ ] Password visibility toggle works
- [ ] Protected routes redirect to auth modal
- [ ] After login, user is redirected to intended page
- [ ] Auth state persists on page refresh
- [ ] Logout functionality works
- [ ] User profile displays correctly

### UI/UX Tests

- [ ] Modal opens with smooth animation
- [ ] Neon glow effects are visible
- [ ] Form inputs have focus states
- [ ] Error messages display properly
- [ ] Loading states work (spinner, disabled buttons)
- [ ] Modal closes cleanly
- [ ] Mobile responsive design works
- [ ] Toggle between login/register is smooth

### Edge Cases

- [ ] What happens if Firebase is down?
- [ ] What if user closes modal without completing?
- [ ] Duplicate email registration error handling
- [ ] Weak password error handling
- [ ] Network timeout handling

---

## 🎯 Next Steps

### 1. **Update Existing Course Cards**

Modify your `DrumCoursesSection.tsx` to use `EnrollButton`:

```tsx
import EnrollButton from "@/components/ui/EnrollButton";

// Inside your course card
<EnrollButton courseId={course.id} />
```

### 2. **Add Navbar Auth State**

Update `Navbar.tsx` to show user profile/logout:

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/auth";

const { isAuthenticated, userProfile } = useAuth();

{isAuthenticated ? (
  <div>
    <span>Welcome, {userProfile?.displayName}</span>
    <button onClick={() => logoutUser()}>Logout</button>
  </div>
) : (
  <button onClick={() => router.push("/?auth=true")}>Sign In</button>
)}
```

### 3. **Protect More Routes**

Wrap any protected pages with `<AuthGuard>`:

```tsx
// src/app/my-courses/page.tsx
import AuthGuard from "@/components/auth/AuthGuard";

export default function MyCoursesPage() {
  return (
    <AuthGuard>
      {/* Your content */}
    </AuthGuard>
  );
}
```

### 4. **Add User Dashboard**

Create `/app/dashboard/page.tsx`:

```tsx
"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { userProfile } = useAuth();

  return (
    <AuthGuard>
      <div>
        <h1>Dashboard</h1>
        <p>Name: {userProfile?.displayName}</p>
        <p>Email: {userProfile?.email}</p>
        <p>District: {userProfile?.district}</p>
        <p>Age: {userProfile?.age}</p>
        <p>Phone: {userProfile?.phone}</p>
        <p>School/Uni: {userProfile?.schoolOrUniversity}</p>
      </div>
    </AuthGuard>
  );
}
```

---

## 🐛 Troubleshooting

### Issue: "Auth state not persisting"
**Solution**: Check that `AuthProvider` is wrapping your app in `layout.tsx`

### Issue: "Redirect loop"
**Solution**: Ensure `AuthGuard` fallback URL is not itself protected

### Issue: "Modal not opening"
**Solution**: Check `useAuthModal()` is called in a client component with `"use client"`

### Issue: "Firebase errors"
**Solution**: Verify `.env.local` variables are prefixed with `NEXT_PUBLIC_`

---

## 📚 Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎉 Success!

You now have a fully functional authentication system with:

✅ Firebase Auth integration  
✅ Premium neon-themed UI  
✅ Route protection  
✅ User profile management  
✅ Redirect flow handling  
✅ Responsive design  

**Happy coding! 🚀🎵**
