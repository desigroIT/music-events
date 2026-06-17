# 🔐 Authentication Flow Diagram

## 📊 Complete Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Homepage   │
│  (page.tsx)  │
└──────┬───────┘
       │
       │ User clicks "Enroll Now"
       │
       ▼
┌──────────────────┐
│ Is Authenticated?│◄────── useAuth() hook checks
└────┬─────────┬───┘        AuthContext state
     │         │
   YES│         │NO
     │         │
     ▼         ▼
┌─────────┐  ┌────────────────────────────┐
│Go to    │  │ Redirect to:               │
│Course   │  │ /?auth=true                │
│Page     │  │ &redirect=/course/{id}     │
└─────────┘  └─────────┬──────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  AuthModal     │
              │  Opens Auto    │◄─── useAuthModal() detects
              │  (AuthModal)   │     ?auth=true in URL
              └────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   LOGIN│              REGISTER│
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────────┐
│Email          │    │Email (Required)    │
│Password       │    │Password (Required) │
│               │    │Confirm (Required)  │
│               │    │Name (Required)     │
│               │    │─────────────────── │
│               │    │District (Optional) │
│               │    │Age (Optional)      │
│               │    │Phone (Optional)    │
│               │    │School (Optional)   │
└───────┬───────┘    └─────────┬──────────┘
        │                      │
        │ Firebase Auth        │ Firebase Auth
        │ signIn()             │ createUser()
        │                      │ + updateProfile()
        │                      │ + Firestore save
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  SUCCESS             │
        │  User authenticated  │
        │  AuthContext updated │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Redirect to:         │
        │ /course/{id}         │◄── redirect param from URL
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Course Detail Page  │
        │  (Protected Route)   │
        │                      │
        │  ┌────────────────┐  │
        │  │  AuthGuard     │  │
        │  │  Validates     │  │
        │  │  Auth State    │  │
        │  └────────┬───────┘  │
        │           │          │
        │         ✅PASS       │
        │           │          │
        │           ▼          │
        │  ┌────────────────┐  │
        │  │ Show Course    │  │
        │  │ Content        │  │
        │  └────────────────┘  │
        └──────────────────────┘
```

---

## 🔄 Component Interaction Map

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Root                        │
│                      (layout.tsx)                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              AuthProvider (Context)                     │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Manages global auth state:                      │  │ │
│  │  │  • user (Firebase User)                          │  │ │
│  │  │  • userProfile (Firestore data)                  │  │ │
│  │  │  • loading (initialization state)                │  │ │
│  │  │  • isAuthenticated (boolean)                     │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  All child components can access via:                   │ │
│  │  const { user, isAuthenticated } = useAuth()            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        │
        │ Provides context to all pages
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                         Pages                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐     ┌────────────────┐                 │
│  │  page.tsx      │     │  course/[id]   │                 │
│  │  (Homepage)    │     │  (Protected)   │                 │
│  │                │     │                │                 │
│  │  • useAuth()   │     │  <AuthGuard>   │◄─── Wraps page │
│  │  • AuthModal   │     │    checks      │     content    │
│  │                │     │    auth state  │                 │
│  └────────────────┘     │  </AuthGuard>  │                 │
│                         └────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Services                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │  Firebase Auth   │        │  Firestore DB    │          │
│  │                  │        │                  │          │
│  │  • User auth     │        │  • User profiles │          │
│  │  • Email/Pass    │        │  • Course data   │          │
│  │  • Sessions      │        │  • Enrollments   │          │
│  └──────┬───────────┘        └──────┬───────────┘          │
│         │                           │                       │
└─────────┼───────────────────────────┼───────────────────────┘
          │                           │
          │ auth.ts                   │ firestore.ts
          │ Functions                 │ Functions
          │                           │
          ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  registerUser()        getCourseById()                       │
│  loginUser()           getUserProfile()                      │
│  logoutUser()          updateUserProfile()                   │
│  subscribeToAuth()     createCourse()                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
          │                           │
          │                           │
          ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • AuthModal (form UI)                                       │
│  • AuthGuard (route protection)                              │
│  • EnrollButton (smart navigation)                           │
│  • Course pages (display data)                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
          │
          │ User interactions
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Request to Protected Route                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │   AuthGuard       │
                  │   Component       │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Check useAuth()   │
                  │ isAuthenticated   │
                  └─────────┬─────────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
            TRUE  │                   │  FALSE
                  │                   │
                  ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ Render Protected │  │ Redirect to:     │
        │ Content          │  │ /?auth=true      │
        │                  │  │ &redirect=...    │
        └──────────────────┘  └─────────┬────────┘
                                        │
                                        ▼
                              ┌─────────────────┐
                              │  Show Login     │
                              │  Modal          │
                              └─────────┬───────┘
                                        │
                                  User logs in
                                        │
                                        ▼
                              ┌─────────────────┐
                              │ Redirect back   │
                              │ to intended     │
                              │ page            │
                              └─────────────────┘
```

---

## 📱 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                      AuthContext State                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Initial State (on app load):                                │
│  {                                                           │
│    user: null,                                               │
│    userProfile: null,                                        │
│    loading: true,              ◄─── Blocks rendering        │
│    isAuthenticated: false                                    │
│  }                                                           │
│                                                              │
│  ▼ Firebase initializes                                      │
│                                                              │
│  After Auth Check (not logged in):                           │
│  {                                                           │
│    user: null,                                               │
│    userProfile: null,                                        │
│    loading: false,             ◄─── Can render now          │
│    isAuthenticated: false                                    │
│  }                                                           │
│                                                              │
│  ▼ User logs in                                              │
│                                                              │
│  After Login Success:                                        │
│  {                                                           │
│    user: { uid, email, ... },  ◄─── Firebase User object    │
│    userProfile: {              ◄─── From Firestore          │
│      uid,                                                    │
│      email,                                                  │
│      displayName,                                            │
│      district,                                               │
│      age,                                                    │
│      phone,                                                  │
│      schoolOrUniversity                                      │
│    },                                                        │
│    loading: false,                                           │
│    isAuthenticated: true       ◄─── Can access protected    │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Component Tree

```
App
│
├── AuthProvider (Wraps entire app)
│   │
│   └── Page Components
│       │
│       ├── HomePage
│       │   ├── Navbar
│       │   │   └── (Shows login/profile based on auth)
│       │   │
│       │   ├── DrumCoursesSection
│       │   │   └── CourseCard
│       │   │       └── EnrollButton ◄─── Smart auth check
│       │   │
│       │   └── AuthModal ◄─── Opens via useAuthModal()
│       │       │
│       │       ├── Login Form
│       │       │   ├── Email input
│       │       │   └── Password input
│       │       │
│       │       └── Register Form
│       │           ├── Email input (Required)
│       │           ├── Password input (Required)
│       │           ├── Confirm Password (Required)
│       │           ├── Name input (Required)
│       │           ├── ─────────────────────────
│       │           ├── District input (Optional)
│       │           ├── Age input (Optional)
│       │           ├── Phone input (Optional)
│       │           └── School input (Optional)
│       │
│       └── Course Detail Page
│           │
│           └── AuthGuard ◄─── Protects this page
│               │
│               ├── Course Header
│               │   └── User Profile Display
│               │
│               ├── Course Info
│               │   ├── Title
│               │   ├── Instructor
│               │   ├── Price
│               │   └── Stats
│               │
│               └── Lesson List
│                   ├── Lesson 1 (Unlocked)
│                   ├── Lesson 2 (Unlocked)
│                   └── Lesson 3 (Locked)
│
└── FirebaseAnalytics
```

---

## 🚀 Quick Reference

### Key Files & Their Roles

| File | Role | Exports |
|------|------|---------|
| `auth.ts` | Auth logic | Functions for register/login/logout |
| `AuthContext.tsx` | Global state | `useAuth()` hook, `AuthProvider` |
| `AuthModal.tsx` | UI | Login/Register modal component |
| `AuthGuard.tsx` | Protection | Route guard component |
| `EnrollButton.tsx` | Navigation | Smart button with auth check |
| `useAuthModal.ts` | Utility | Modal state management hook |

### Key Hooks

```tsx
// Get auth state anywhere
const { user, userProfile, isAuthenticated, loading } = useAuth();

// Manage auth modal
const { isOpen, redirectTo, openModal, closeModal } = useAuthModal();
```

### Key Functions

```tsx
// From lib/auth.ts
await registerUser(email, password, name, optionalData);
await loginUser(email, password);
await logoutUser();
await getUserProfile(uid);
await updateUserProfile(uid, data);
```

---

## 🎯 This diagram helps you understand:

1. **How user flows through authentication**
2. **Which components interact with each other**
3. **Where data is stored and retrieved**
4. **How route protection works**
5. **State management architecture**

Use this as a reference when implementing or debugging! 🚀
