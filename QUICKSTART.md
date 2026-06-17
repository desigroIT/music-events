# 🚀 Quick Start - 5 Minute Setup

## ✅ Pre-flight Checklist

### 1. Environment Variables (30 seconds)

Verify your `.env.local` file exists with Firebase credentials:

```bash
cat .env.local
```

Should see:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... etc
```

❌ **Missing?** Copy from Firebase Console → Project Settings → General

---

### 2. Firebase Console Setup (2 minutes)

#### Enable Authentication:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** → **Get Started**
4. Enable **Email/Password** sign-in method
5. Click **Save**

#### Verify Firestore:
1. Click **Firestore Database**
2. Should already be created
3. ✅ Done!

---

### 3. Test the Authentication (2 minutes)

#### Start the dev server:
```bash
npm run dev
```

#### Open your browser:
```
http://localhost:3000/?auth=true
```

You should see:
- ✅ Animated neon auth modal
- ✅ Login/Register toggle
- ✅ Form fields with icons

#### Test Registration:
1. Click "Register" (if not already there)
2. Fill in:
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm: `test123`
   - Name: `Test User`
3. Click **CREATE ACCOUNT**

✅ **Success!** You should be registered and the modal closes.

#### Test Login:
1. Reload page: `http://localhost:3000/?auth=true`
2. Use same credentials
3. Click **SIGN IN**

✅ **Success!** You're logged in.

---

## 🎯 Verify Everything Works

### Test Protected Route:

```
http://localhost:3000/course/test-123
```

**Expected behavior:**
- 🔒 Not logged in? → Redirects to `/?auth=true&redirect=/course/test-123`
- ✅ Logged in? → Shows course page with your profile in header

---

## 🔧 Integration Steps

### Step 1: Update Course Cards (5 minutes)

Find your course card component (e.g., `DrumCoursesSection.tsx`):

**Before:**
```tsx
<button onClick={() => router.push('/course/' + course.id)}>
  ENROLL NOW
</button>
```

**After:**
```tsx
import EnrollButton from "@/components/ui/EnrollButton";

<EnrollButton courseId={course.id} />
```

### Step 2: Add Navbar Auth (10 minutes)

Update your `Navbar.tsx`:

```tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, userProfile } = useAuth();
  const router = useRouter();

  return (
    <nav>
      {/* Your existing nav items */}
      
      <div className="auth-section">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span>Welcome, {userProfile?.displayName}!</span>
            <button 
              onClick={async () => {
                await logoutUser();
                router.push('/');
              }}
              className="btn-logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => router.push('/?auth=true')}
            className="btn-signin"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
```

### Step 3: Create More Protected Pages (Optional)

**Dashboard Example:**

Create `src/app/dashboard/page.tsx`:

```tsx
"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { userProfile } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black p-8">
        <h1 className="text-4xl font-orbitron text-white mb-8">
          My Dashboard
        </h1>
        
        <div className="glass-card p-6">
          <h2 className="text-xl text-white mb-4">Profile</h2>
          <p className="text-white/60">Name: {userProfile?.displayName}</p>
          <p className="text-white/60">Email: {userProfile?.email}</p>
          <p className="text-white/60">District: {userProfile?.district || 'N/A'}</p>
        </div>
      </div>
    </AuthGuard>
  );
}
```

---

## 🎨 Styling Tips

### Neon Glow on Buttons:
```tsx
<button className="bg-gradient-to-r from-[#FF4500] to-[#FF8C00] hover:shadow-2xl hover:shadow-[#FF4500]/30">
  Click Me
</button>
```

### Animated Background:
```tsx
<div className="neon-glow">
  Your content
</div>
```

### Glass Card:
```tsx
<div className="glass-card p-6 border border-white/10">
  Your content
</div>
```

---

## 🐛 Common Issues & Fixes

### Issue: "Auth modal won't open"
**Fix:** Make sure you're using `"use client"` at the top of the component.

### Issue: "Firebase errors in console"
**Fix:** Double-check `.env.local` variables have `NEXT_PUBLIC_` prefix.

### Issue: "Redirect loop"
**Fix:** Ensure `AuthGuard` `fallbackUrl` is not itself protected.

### Issue: "Auth state not persisting"
**Fix:** Verify `AuthProvider` wraps your app in `layout.tsx`.

### Issue: "Modal appears but won't submit"
**Fix:** Open browser console, check for Firebase Auth errors (likely API key issue).

---

## ✨ You're Done!

Your authentication system is now:
- ✅ Fully functional
- ✅ Beautifully styled
- ✅ Production-ready

### Next Steps:
1. ✅ Test registration/login flows
2. ✅ Update course cards with `<EnrollButton>`
3. ✅ Add auth state to navbar
4. ✅ Create protected dashboard page
5. ✅ Deploy to production!

---

## 📚 Documentation Links

- **Full Guide:** `AUTHENTICATION_GUIDE.md`
- **Architecture:** `AUTH_FLOW_DIAGRAM.md`
- **Summary:** `AUTH_IMPLEMENTATION_SUMMARY.md`

---

## 🎉 Questions?

Refer to the comprehensive guides above, or check:
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Next.js App Router](https://nextjs.org/docs/app)

**Happy coding! 🚀🎵**
