# Enhanced Access Control - Subscription Approval Required

## Overview

Enhanced the verification system to require **BOTH** user verification status **AND** approved subscription request for accessing paid courses.

## Access Control Requirements

### For Paid Course Access, Users Must Have:

1. ✅ **Verified Status**: `StatutUser === 'verified'` OR `'subscribed'`
2. ✅ **Approved Subscription**: At least one `DemandeInscription` with `status === 'APPROVED'`

### Access Matrix

| StatutUser   | DemandeInscription Status | Access Level          |
| ------------ | ------------------------- | --------------------- |
| `awaiting`   | Any                       | **Free courses only** |
| `verified`   | `PENDING`                 | **Free courses only** |
| `verified`   | `REJECTED`                | **Free courses only** |
| `verified`   | `APPROVED`                | **All courses** ✅    |
| `subscribed` | `PENDING`                 | **Free courses only** |
| `subscribed` | `APPROVED`                | **All courses** ✅    |

## Implementation Details

### Verification Logic

```typescript
// Check both conditions
const hasVerifiedStatus =
  user.StatutUser === "verified" || user.StatutUser === "subscribed";

const hasApprovedSubscription = user.demandeInscription?.some(
  (demande: any) => demande.status === "APPROVED",
);

// Both must be true for full access
const isVerified = hasVerifiedStatus && hasApprovedSubscription;
```

## Files Modified

### 1. `/matiere/[id]/page.tsx` - Subject Detail Page

**Enhanced Verification:**

- Checks `StatutUser` for verified/subscribed status
- Checks `demandeInscription` array for at least one APPROVED request
- Filters courses based on combined verification result
- Passes both `isVerified` and `hasApprovedSubscription` to child component

**Code:**

```typescript
const hasVerifiedStatus =
  user.StatutUser === "verified" || user.StatutUser === "subscribed";

const hasApprovedSubscription = user.demandeInscription?.some(
  (demande: any) => demande.status === "APPROVED",
);

const isVerified = hasVerifiedStatus && hasApprovedSubscription;
```

### 2. `Dashboard.tsx` - Main Dashboard

**Enhanced Verification:**

- Same dual-check logic as subject page
- Filters all courses in `filteredGrades` memo
- Shows context-specific notification messages
- Hides paid/free toggle for non-verified users

**Context-Aware Messaging:**

```typescript
{
  !hasApprovedSubscription
    ? "Votre demande d'inscription est en cours de traitement..."
    : "Votre compte n'est pas encore vérifié...";
}
```

### 3. `CoursDtails.tsx` - Course Details Component

**Enhanced Props:**

- Added `hasApprovedSubscription` prop
- Shows different messages based on subscription status
- Maintains backward compatibility with defaults

**Message Logic:**

- If no approved subscription → "Demande en cours de traitement"
- If approved but not verified → "Compte non vérifié"

## User Experience Scenarios

### Scenario 1: Pending Subscription Request

**User State:**

- `StatutUser`: Any
- `DemandeInscription[0].status`: `PENDING`

**Experience:**

- 🔵 Blue banner: "Votre demande d'inscription est en cours de traitement..."
- 👁️ Only free courses visible
- 🚫 No paid/free toggle
- ⏳ Waiting for admin approval

### Scenario 2: Approved Subscription, Not Verified

**User State:**

- `StatutUser`: `awaiting`
- `DemandeInscription[0].status`: `APPROVED`

**Experience:**

- 🔵 Blue banner: "Votre compte n'est pas encore vérifié..."
- 👁️ Only free courses visible
- 📧 Prompted to contact administration

### Scenario 3: Rejected Subscription

**User State:**

- `StatutUser`: Any
- `DemandeInscription[0].status`: `REJECTED`

**Experience:**

- 🔵 Blue banner: "Votre compte n'est pas encore vérifié..."
- 👁️ Only free courses visible
- 📧 Need to contact administration

### Scenario 4: Fully Verified (Success Case)

**User State:**

- `StatutUser`: `verified` OR `subscribed`
- `DemandeInscription[0].status`: `APPROVED`

**Experience:**

- ✅ No banners
- ✅ All courses visible
- ✅ Full toggle functionality
- ✅ Complete access

## Database Schema Reference

```prisma
model User {
  StatutUser StatutUser @default(awaiting)
  demandeInscription DemandeInscription[]
}

enum StatutUser {
  subscribed
  awaiting
  verified
}

model DemandeInscription {
  status DemandeInscriptionStatus @default(PENDING)
  userId String
  user   User @relation(...)
}

enum DemandeInscriptionStatus {
  PENDING   // En attente
  APPROVED  // Approuvée ✅
  REJECTED  // Rejetée
  CANCELLED // Annulée
}
```

## Security Benefits

### Multi-Layer Verification

1. **User Status Check**: Prevents access for unverified users
2. **Subscription Check**: Ensures payment/approval process completed
3. **Server-Side Filtering**: Cannot be bypassed client-side
4. **Consistent Application**: Applied across all views

### Prevents Unauthorized Access

- Users can't access paid courses by just changing `StatutUser`
- Subscription must be explicitly approved by admin
- Both conditions must be met simultaneously

## Admin Workflow Integration

### For Admins to Grant Access:

1. **Approve Subscription Request**:
   - Update `DemandeInscription.status` to `APPROVED`
2. **Verify User Account**:
   - Update `User.StatutUser` to `verified` or `subscribed`

3. **Result**: User gains full access to paid courses

### Partial Access Scenarios:

- Approve subscription but don't verify → Still no access
- Verify user but don't approve subscription → Still no access
- Both must be done for full access

## Testing Checklist

### Test Case 1: New User Registration

- [ ] User registers
- [ ] `StatutUser` = `awaiting`
- [ ] No `DemandeInscription` or status = `PENDING`
- [ ] Verify: Only free courses visible

### Test Case 2: Subscription Approved, User Not Verified

- [ ] Admin approves `DemandeInscription`
- [ ] `StatutUser` still `awaiting`
- [ ] Verify: Still only free courses visible
- [ ] Verify: Message about account verification

### Test Case 3: User Verified, Subscription Pending

- [ ] Admin sets `StatutUser` to `verified`
- [ ] `DemandeInscription` still `PENDING`
- [ ] Verify: Still only free courses visible
- [ ] Verify: Message about pending subscription

### Test Case 4: Full Access Granted

- [ ] Admin approves `DemandeInscription`
- [ ] Admin sets `StatutUser` to `verified`
- [ ] Verify: All courses visible
- [ ] Verify: No restriction banners
- [ ] Verify: Toggle works

### Test Case 5: Subscription Rejected

- [ ] Admin rejects `DemandeInscription`
- [ ] Verify: Only free courses visible
- [ ] Verify: Appropriate messaging

## Message Variations

### Dashboard Messages

**Pending Subscription:**

> "Votre demande d'inscription est en cours de traitement. Vous ne pouvez accéder qu'aux cours gratuits en attendant l'approbation de votre demande."

**Not Verified (but subscription approved):**

> "Votre compte n'est pas encore vérifié. Vous ne pouvez accéder qu'aux cours gratuits. Contactez l'administration pour obtenir l'accès complet à tous les cours."

### Subject Page Messages

Same as dashboard, context-aware based on `hasApprovedSubscription` flag.

## Migration & Backward Compatibility

### Existing Users

- Users with `StatutUser = 'verified'` need approved subscription
- May need bulk approval of existing subscriptions
- Or grandfather existing verified users

### Default Values

- `isVerified = true` (default in components)
- `hasApprovedSubscription = true` (default in components)
- Ensures backward compatibility

## Future Enhancements

1. **Email Notifications**:
   - When subscription is approved
   - When account is verified
   - When both conditions are met

2. **Status Dashboard**:
   - Show checklist of requirements
   - Progress indicator for verification

3. **Automatic Verification**:
   - Auto-verify on payment confirmation
   - Auto-approve based on criteria

4. **Grace Period**:
   - Trial access to paid courses
   - Time-limited full access

5. **Subscription Tiers**:
   - Different approval levels
   - Partial access to some paid courses

## Summary

This enhanced access control provides:

- ✅ **Dual-verification** for maximum security
- ✅ **Context-aware messaging** for better UX
- ✅ **Admin control** over both verification steps
- ✅ **Flexible workflow** for different approval processes
- ✅ **Clear communication** about access status
- ✅ **Backward compatible** with existing code

The system now requires explicit approval at both the user level (`StatutUser`) and subscription level (`DemandeInscription`) before granting access to paid courses.
