# 🔥 Firebase Firestore Structure

## Database Collections

### 📚 1. Courses Collection
Stores all drum course data.

**Path**: `courses/{courseId}`

**Structure**:
```
courses/
├── {courseId1}/
│   ├── title: string
│   ├── instructor: string
│   ├── level: string
│   ├── duration: string
│   ├── lessons: number
│   ├── students: number
│   ├── rating: number
│   ├── price: number
│   ├── badge: string
│   ├── badgeColor: string
│   ├── tags: array
│   ├── description: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── {courseId2}/
│   └── ...
│
└── config/                          ← Special config document
    └── header-section/              ← Subcollection
        └── data/                    ← Document
            ├── sectionLabel: string
            ├── mainTitle: string
            ├── subtitle: string
            └── updatedAt: timestamp
```

### 📝 Section Header Configuration

**Path**: `courses/config/header-section/data`

This stores the editable section header text for the Courses section.

**Fields**:
```json
{
  "sectionLabel": "Master Your Rhythm",
  "mainTitle": "Drum Courses",
  "subtitle": "From tabla foundations to metal blast beats — learn from the world's finest percussionists.",
  "updatedAt": "timestamp"
}
```

## Visual Structure

```
Firestore Database
│
└── courses (collection)
    │
    ├── 001-beginner-drumming (document) ← Actual course
    │   ├── title: "Beginner Drumming Fundamentals"
    │   ├── instructor: "Alex Rodriguez"
    │   ├── price: 49
    │   └── ...
    │
    ├── 002-jazz-drumming (document) ← Actual course
    │   ├── title: "Jazz Kit Mastery"
    │   └── ...
    │
    └── config (document) ← Configuration document
        │
        └── header-section (subcollection)
            │
            └── data (document) ← Section header data
                ├── sectionLabel: "Master Your Rhythm"
                ├── mainTitle: "Drum Courses"
                ├── subtitle: "From tabla foundations..."
                └── updatedAt: timestamp
```

## Data Flow

### Admin Dashboard → Firebase
```
User edits section header in admin panel
         ↓
Clicks "Save Changes"
         ↓
updateSectionHeader(data, "courses")
         ↓
Firebase: courses/config/header-section/data
         ↓
Document created/updated with merge
         ↓
Success notification shown
```

### Firebase → Main Website
```
User visits main website
         ↓
DrumCoursesSection loads
         ↓
getSectionHeader("courses")
         ↓
Firebase: courses/config/header-section/data
         ↓
Data fetched
         ↓
Section header rendered with Firebase data
         ↓
Falls back to defaults if data not found
```

## API Functions

### Get Section Header
```typescript
const header = await getSectionHeader("courses");
// Returns: { sectionLabel, mainTitle, subtitle, updatedAt }
```

### Update Section Header
```typescript
const success = await updateSectionHeader(
  {
    sectionLabel: "New Label",
    mainTitle: "New Title",
    subtitle: "New subtitle..."
  },
  "courses"
);
// Returns: boolean (true if successful)
```

## Firebase Console View

When you open Firebase Console, you'll see:

```
📁 courses (Collection)
  │
  ├── 📄 abc123xyz (Course Document)
  │
  ├── 📄 def456uvw (Course Document)
  │
  └── 📄 config (Configuration Document)
      └── 📁 header-section (Subcollection)
          └── 📄 data (Header Data)
              ├── sectionLabel: "Master Your Rhythm"
              ├── mainTitle: "Drum Courses"
              ├── subtitle: "From tabla..."
              └── updatedAt: Jan 17, 2025 at 10:30:45 AM
```

## Why This Structure?

### ✅ Advantages

1. **Organized**: Configuration separate from course data
2. **Scalable**: Easy to add more config subcollections
3. **Clean**: No mixing of data types in same collection
4. **Logical**: courses/config/header-section makes semantic sense
5. **Extensible**: Can add more config types later

### Example Extensions

```
courses/
├── config/
│   ├── header-section/data      ← Section header
│   ├── settings/data            ← Future: Display settings
│   ├── filters/data             ← Future: Filter options
│   └── categories/data          ← Future: Course categories
│
├── course-1/
├── course-2/
└── ...
```

## Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Courses collection
    match /courses/{courseId} {
      // Allow everyone to read courses
      allow read: if true;
      
      // Only admins can write courses
      allow write: if request.auth != null 
        && request.auth.token.admin == true;
      
      // Config subcollection
      match /config/header-section/data {
        // Allow everyone to read
        allow read: if true;
        
        // Only admins can write
        allow write: if request.auth != null 
          && request.auth.token.admin == true;
      }
    }
  }
}
```

## Testing in Firebase Console

### 1. Navigate to Firestore
```
Firebase Console → Firestore Database → Data
```

### 2. Find the Structure
```
Click: courses (collection)
  → Click: config (document)
    → Click: header-section (subcollection)
      → Click: data (document)
```

### 3. View/Edit Data
You'll see:
- sectionLabel
- mainTitle
- subtitle
- updatedAt

## Common Operations

### Create Initial Header
```typescript
// Automatically created when you first save in admin panel
// Or manually via Firebase Console:
// 1. Create 'courses' collection
// 2. Create 'config' document
// 3. Create 'header-section' subcollection
// 4. Create 'data' document
// 5. Add fields: sectionLabel, mainTitle, subtitle
```

### Update Header from Admin
```typescript
// In admin dashboard:
// 1. Click edit icon on section header
// 2. Modify text
// 3. Click "Save Changes"
// ✓ Firebase automatically updated
```

### Read Header on Website
```typescript
// Automatically loaded when section renders
// Falls back to default text if not found
useEffect(() => {
  const loadHeader = async () => {
    const data = await getSectionHeader("courses");
    if (data) {
      setSectionHeader(data);
    }
  };
  loadHeader();
}, []);
```

## Backup & Export

### Export Header Data
```bash
# Using Firebase CLI
firebase firestore:export ./backup

# Or from Console
Firebase Console → Firestore → Import/Export
```

### Import Header Data
```bash
firebase firestore:import ./backup
```

## Monitoring

### Check Updates
```
Firebase Console → Firestore → courses/config/header-section/data
→ See updatedAt timestamp
```

### Usage Metrics
```
Firebase Console → Firestore → Usage
→ See read/write operations
```

---

**Last Updated**: 2026-06-17  
**Structure Version**: 1.0  
**Status**: ✅ Production Ready
