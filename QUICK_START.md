# 🚀 Quick Start Guide

## 1️⃣ Start the Development Server

```bash
npm run dev
```

Wait for the message:
```
✓ Ready in Xms
○ Local:        http://localhost:3000
```

## 2️⃣ Access the Admin Dashboard

Open your browser and navigate to:
```
http://localhost:3000/admin92-studio-musicians
```

## 3️⃣ Sync Initial Data

1. You'll see the Courses panel (first menu item)
2. If no courses exist, click the **"Sync Now"** button
3. Confirm the sync operation
4. Wait for success message
5. Courses will appear in the grid

## 4️⃣ Manage Courses

### Add a New Course
1. Click **"Add Course"** button (orange)
2. Fill in all required fields (marked with *)
3. Add tags by typing and pressing Enter
4. Click **"Create Course"**

### Edit a Course
1. Hover over any course card
2. Click the **blue edit icon** (top right)
3. Update fields as needed
4. Click **"Update Course"**

### Delete a Course
1. Hover over any course card
2. Click the **red delete icon** (top right)
3. Confirm deletion

### Search Courses
1. Type in the search bar
2. Results filter in real-time
3. Search by: title, instructor, or tags

## 5️⃣ View on Main Website

Visit the main page:
```
http://localhost:3000
```

Scroll to the **Courses** section. You'll see all courses from Firebase displayed with the same beautiful design!

## 🎯 URLs Quick Reference

| Page | URL |
|------|-----|
| Main Website | `http://localhost:3000` |
| Admin Dashboard | `http://localhost:3000/admin92-studio-musicians` |
| Courses Section | `http://localhost:3000#courses` |

## 🎨 Admin Features

### Left Sidebar
- 📚 **Courses** - Manage drum courses (✅ Active)
- 📖 **Academy** - Coming soon
- 👥 **Community** - Coming soon
- 🌐 **Networking** - Coming soon
- 📝 **Blog** - Coming soon
- 📅 **Events** - Coming soon
- 💳 **Membership** - Coming soon

### Right Panel (Courses)
- Section header with "Master Your Rhythm" design
- Search bar with real-time filtering
- Add/Edit/Delete course operations
- Sync dummy data button (when empty)
- Refresh button
- Responsive grid layout

## 🔥 Firebase Integration

### Database: Firestore
- **Collection**: `courses`
- **Auto-sync**: Changes appear on website instantly
- **Fallback**: Uses dummy data if Firebase is empty

### Environment Variables
Check `.env.local` for Firebase configuration:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... etc
```

## 🎬 Demo Workflow

### Complete First-Time Setup:
```bash
# 1. Start server
npm run dev

# 2. Open admin in browser
# → http://localhost:3000/admin92-studio-musicians

# 3. Click "Sync Now" to import courses

# 4. Open main site in new tab
# → http://localhost:3000

# 5. Scroll to Courses section
# → See all synced courses!

# 6. Go back to admin
# → Add a new course

# 7. Refresh main site
# → New course appears!
```

## ✅ Checklist

- [ ] Dev server running
- [ ] Admin dashboard loads
- [ ] Sidebar navigation works
- [ ] Courses panel displays
- [ ] Sync button works
- [ ] Can create course
- [ ] Can edit course
- [ ] Can delete course
- [ ] Search works
- [ ] Main website shows courses
- [ ] Changes sync to website

## 🆘 Troubleshooting

### Server won't start
```bash
# Kill any process on port 3000
npx kill-port 3000

# Try again
npm run dev
```

### Firebase errors
```bash
# Check environment variables
cat .env.local

# Verify Firebase project exists
# → Visit Firebase Console
```

### Courses not showing
1. Check browser console for errors
2. Verify Firebase credentials in `.env.local`
3. Check Firestore rules allow read access
4. Try clicking "Sync Now" again

### Styling issues
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

## 📚 Additional Resources

- `ADMIN_GUIDE.md` - Comprehensive admin documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `.env.example` - Environment variables template

## 🎉 You're All Set!

Your admin dashboard is ready to use. Start managing your courses and watch them appear on the main website in real-time!

**Happy Coding! 🥁🎸🎻**
