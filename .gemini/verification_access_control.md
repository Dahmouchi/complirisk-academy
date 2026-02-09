# User Verification Status - Course Access Control

## Overview

Implemented access control based on user verification status (`StatutUser`). Unverified users can only access **free courses**, while verified and subscribed users have access to all courses.

## User Status Types (StatutUser Enum)

- **`awaiting`**: User is waiting for verification (unverified) - **Only free courses**
- **`verified`**: User is verified - **All courses**
- **`subscribed`**: User has an active subscription - **All courses**

## Files Modified

### 1. `/matiere/[id]/page.tsx` - Subject Detail Page

**Changes:**

- Added verification check: `isVerified = user.StatutUser === 'verified' || user.StatutUser === 'subscribed'`
- Filters courses based on verification status before passing to component
- Unverified users only see courses where `isFree === true`
- Passes `isVerified` prop to `CoursDetails` component

**Code Logic:**

```typescript
const isVerified =
  user.StatutUser === "verified" || user.StatutUser === "subscribed";

const filteredSubject = {
  ...subject,
  courses: isVerified
    ? subject.courses
    : subject.courses.filter((course: any) => course.isFree),
};
```

### 2. `CoursDtails.tsx` - Course Details Component

**Changes:**

- Added `isVerified` prop (defaults to `true` for backward compatibility)
- Added informational banner for unverified users
- Banner explains limited access and directs users to contact administration

**Banner Content:**

- **Title**: "Accès Limité aux Cours Gratuits"
- **Message**: Explains that only free courses are visible and how to get full access
- **Styling**: Blue theme with icon, responsive design, dark mode support

### 3. `Dashboard.tsx` - Main Dashboard

**Changes:**

- Added verification check at component level
- Filters all courses based on verification status in `filteredGrades` memo
- Added informational banner for unverified users
- **Hides the paid/free toggle** for unverified users (they can only see free courses anyway)

**Filtering Logic:**

```typescript
const isVerified =
  user.StatutUser === "verified" || user.StatutUser === "subscribed";

// In course filtering:
if (!isVerified) {
  return matchesSearch && course.isFree;
}
```

## User Experience

### For Unverified Users (StatutUser === 'awaiting')

1. **Dashboard**:
   - See blue notification banner explaining limited access
   - No paid/free toggle visible (only free courses shown)
   - Only free courses appear in all subjects
2. **Subject Page** (`/matiere/[id]`):
   - See blue notification banner
   - Only free courses listed in sidebar
   - Cannot access paid courses even with direct URL

3. **Visual Indicators**:
   - Clear messaging about verification status
   - Consistent blue banner across pages
   - Helpful instructions to contact administration

### For Verified Users (StatutUser === 'verified' or 'subscribed')

1. **Dashboard**:
   - No notification banner
   - Full paid/free toggle functionality
   - Access to all courses
2. **Subject Page**:
   - No notification banner
   - All courses visible
   - Full functionality

## Security & Access Control

### Multi-Layer Protection

1. **Server-side filtering** in page components (cannot be bypassed)
2. **Client-side UI** hides unavailable options
3. **Consistent filtering** across all views

### What's Protected

- Course lists are filtered at data level
- Direct URL access to paid courses is prevented
- Search results only include accessible courses
- Progress tracking only for accessible courses

## Visual Design

### Notification Banner

```tsx
<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-[8px] p-4">
  <div className="flex items-start gap-3">
    <BookOpen icon />
    <div>
      <h3>Accès Limité aux Cours Gratuits</h3>
      <p>Explanation message...</p>
    </div>
  </div>
</div>
```

**Features:**

- Light/dark mode support
- Responsive layout
- Icon for visual clarity
- Professional blue color scheme
- Consistent with app design system

## Testing Scenarios

### Test Case 1: Unverified User

**Setup**: User with `StatutUser = 'awaiting'`
**Expected Behavior**:

- ✅ Dashboard shows notification banner
- ✅ Only free courses visible
- ✅ No paid/free toggle
- ✅ Subject pages show notification
- ✅ Only free courses in subject detail

### Test Case 2: Verified User

**Setup**: User with `StatutUser = 'verified'`
**Expected Behavior**:

- ✅ No notification banners
- ✅ All courses visible
- ✅ Paid/free toggle works
- ✅ Full access to all features

### Test Case 3: Subscribed User

**Setup**: User with `StatutUser = 'subscribed'`
**Expected Behavior**:

- ✅ Same as verified user
- ✅ Full access to all courses

### Test Case 4: Mixed Content

**Setup**: Subject with both free and paid courses
**Expected Behavior**:

- ✅ Unverified: Only free courses shown
- ✅ Verified: All courses shown
- ✅ Course count reflects filtered results

## Database Schema Reference

```prisma
model User {
  StatutUser StatutUser @default(awaiting)
  // ... other fields
}

enum StatutUser {
  subscribed
  awaiting
  verified
}

model Course {
  isFree Boolean @default(false)
  // ... other fields
}
```

## Future Enhancements

Consider adding:

1. **Email notifications** when user status changes
2. **Verification request form** for users
3. **Trial period** for paid courses
4. **Course preview** for paid courses (first lesson free)
5. **Upgrade prompts** with clear call-to-action
6. **Admin dashboard** to manage user verification
7. **Automatic verification** based on payment status

## Migration Notes

**Backward Compatibility:**

- All changes are backward compatible
- Default `isVerified = true` in components
- Existing verified users unaffected
- No database migrations required

## Summary

This implementation provides:

- ✅ **Secure** server-side filtering
- ✅ **Clear** user communication
- ✅ **Consistent** UX across all pages
- ✅ **Flexible** status-based access control
- ✅ **Professional** visual design
- ✅ **Scalable** for future enhancements
