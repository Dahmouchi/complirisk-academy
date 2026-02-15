# Dynamic Cart System - Visual Flow & Summary

## 🎯 Overview

The cart system allows users to:

1. ✅ Browse available grades/courses
2. ✅ Add grades to a persistent cart
3. ✅ View and manage cart items
4. ✅ Submit a demande (request) from cart items
5. ✅ Cart persists across sessions

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                       │
│  (ExplorePage Component - /dashboard/courses)               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT ACTIONS                            │
│  • Click "Ajouter" button                                   │
│  • Click "Remove" icon                                       │
│  • Click "Soumettre ma Demande"                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVER ACTIONS                             │
│  • addToCart(gradeId)                                       │
│  • removeFromCart(gradeId)                                  │
│  • createDemandeFromCart()                                  │
│  • getCart()                                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│  Tables: Cart, CartItem, Grade, DemandeInscription         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow: Adding to Cart

```
1. User browses grades
   ↓
2. Clicks "Ajouter" on a grade card
   ↓
3. addToCart(gradeId) server action called
   ↓
4. Validation checks:
   - Is user authenticated? ✓
   - Does user already own this grade? ✗
   - Does user have pending demande? ✗
   - Is grade already in cart? ✗
   ↓
5. Create CartItem in database
   ↓
6. Return success response
   ↓
7. Show success toast
   ↓
8. Refresh page to show updated cart
   ↓
9. Cart badge updates with new count
```

---

## 🔄 User Flow: Submitting Demande

```
1. User has items in cart
   ↓
2. Clicks "Ma Sélection" button
   ↓
3. Cart sheet/panel opens
   ↓
4. Reviews items and total price
   ↓
5. Clicks "Soumettre ma Demande"
   ↓
6. createDemandeFromCart() server action called
   ↓
7. Transaction begins:
   a. Create DemandeInscription (status: PENDING)
   b. Create DemandeInscriptionGrade for each cart item
   c. Clear all cart items
   ↓
8. Transaction commits
   ↓
9. Show success message
   ↓
10. Redirect to dashboard
    ↓
11. Admin can now review the demande
```

---

## 📁 File Structure

```
complirisk-academy/
│
├── src/
│   ├── app/
│   │   └── (user)/
│   │       ├── _actions/
│   │       │   └── cartActions.ts          ← Server actions
│   │       └── dashboard/
│   │           └── courses/
│   │               └── page.tsx            ← Fetches cart data
│   │
│   └── components/
│       ├── cart/
│       │   └── CartButton.tsx              ← Reusable cart button
│       └── newDash/
│           └── ExplorePage.tsx             ← Main cart UI
│
├── prisma/
│   └── schema.prisma                       ← Cart & CartItem models
│
├── CART_SYSTEM_DOCUMENTATION.md            ← Full documentation
└── CART_IMPLEMENTATION_GUIDE.md            ← Quick guide
```

---

## 🗄️ Database Schema

```
┌──────────────┐
│     User     │
│──────────────│
│ id (PK)      │
│ email        │
│ name         │
│ ...          │
└──────┬───────┘
       │ 1
       │
       │ 1
┌──────▼───────┐         ┌──────────────┐
│     Cart     │         │    Grade     │
│──────────────│         │──────────────│
│ id (PK)      │         │ id (PK)      │
│ userId (FK)  │         │ name         │
│ createdAt    │         │ price        │
│ updatedAt    │         │ ...          │
└──────┬───────┘         └──────┬───────┘
       │ 1                      │ 1
       │                        │
       │ N                      │ N
┌──────▼────────────────────────▼───────┐
│           CartItem                     │
│────────────────────────────────────────│
│ id (PK)                                │
│ cartId (FK) ──→ Cart                  │
│ gradeId (FK) ──→ Grade                │
│ priceAtAdd (snapshot)                  │
│ addedAt                                │
│ UNIQUE(cartId, gradeId)                │
└────────────────────────────────────────┘
```

---

## 🎨 UI Components

### 1. Grade Card (in ExplorePage)

```
┌─────────────────────────────┐
│  🎓 Grade Name              │
│  ─────────────────────────  │
│  Matières: Math, Physics... │
│  Price: 1500 MAD            │
│  ─────────────────────────  │
│  [  ➕ Ajouter  ]           │
└─────────────────────────────┘
```

### 2. Cart Sheet/Panel

```
┌─────────────────────────────┐
│  🛒 Ma Sélection            │
│  ─────────────────────────  │
│  ISO 37001 Lead             │
│  1500 MAD            [🗑️]   │
│  ─────────────────────────  │
│  ISO 27001 Foundation       │
│  1200 MAD            [🗑️]   │
│  ─────────────────────────  │
│  Total: 2700 MAD            │
│  ─────────────────────────  │
│  [ Soumettre ma Demande ]   │
└─────────────────────────────┘
```

### 3. Cart Button (with badge)

```
┌──────────────────┐
│  🛒 Mon Panier ② │  ← Badge shows count
└──────────────────┘
```

---

## 🔐 Security & Validation

### Server-Side Validation

✅ User authentication (via NextAuth session)
✅ User authorization (can only modify own cart)
✅ Grade ownership check
✅ Pending demande check
✅ Duplicate prevention
✅ Grade existence validation

### Database Constraints

✅ Unique constraint on (cartId, gradeId)
✅ Foreign key constraints
✅ Cascade deletes
✅ One cart per user (unique userId)

---

## 📈 Data Flow Example

### Adding Grade to Cart

```typescript
// 1. User clicks "Ajouter"
onClick={() => addToCart(grade)}

// 2. Server action executes
export async function addToCart(gradeId: string) {
  // Get session
  const session = await getServerSession(authOptions);

  // Validate user
  if (!session?.user?.id) return { success: false };

  // Check if user owns grade
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { grades: true }
  });

  if (user?.grades.some(g => g.id === gradeId)) {
    return { success: false, error: "Already owned" };
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id }
    });
  }

  // Add item to cart
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      gradeId: gradeId,
      priceAtAdd: grade.price
    }
  });

  return { success: true };
}

// 3. Client receives response
if (result.success) {
  toast.success("Added!");
  router.refresh(); // Refresh to show updated cart
}
```

---

## 🎯 Key Features

### 1. Persistence

- Cart data stored in PostgreSQL database
- Survives browser refresh, logout/login
- Accessible from any device

### 2. Price Snapshot

- Price stored when item added to cart
- Protects against price changes
- User sees consistent pricing

### 3. Atomic Operations

- Cart → Demande conversion uses transaction
- All-or-nothing: either everything succeeds or nothing changes
- Prevents partial data corruption

### 4. Optimistic UI

- Immediate feedback to user
- Server validation happens in background
- Rollback if validation fails

---

## 🚀 Performance Considerations

### Optimizations

✅ Efficient database queries with `include`
✅ Minimal data transfer (only necessary fields)
✅ Revalidation paths for cache management
✅ Memoized computed values (useMemo)

### Caching Strategy

- Server components fetch fresh data
- Client components use optimistic updates
- `router.refresh()` revalidates server data

---

## 📝 Summary

### What Changed

1. ❌ **Before**: Cart in React state (lost on refresh)
2. ✅ **After**: Cart in database (persistent)

### Benefits

✅ Cart persists across sessions
✅ Better user experience
✅ Data integrity and validation
✅ Admin can see user carts
✅ Price tracking and history
✅ Scalable architecture

### Files Created

- `cartActions.ts` - Server actions
- `CartButton.tsx` - Reusable component
- Documentation files

### Files Modified

- `ExplorePage.tsx` - Uses persistent cart
- `courses/page.tsx` - Fetches cart data

---

## 🎓 Next Steps

1. **Test the cart system**
   - Add items to cart
   - Remove items
   - Submit demande
   - Verify persistence

2. **Add cart to navigation**
   - Show cart count badge
   - Quick access to cart

3. **Enhance UI**
   - Add animations
   - Improve mobile experience
   - Add empty cart state

4. **Optional features**
   - Cart expiration
   - Save for later
   - Cart sharing
   - Price alerts

---

## 📞 Support

For questions or issues:

1. Check `CART_SYSTEM_DOCUMENTATION.md`
2. Review `CART_IMPLEMENTATION_GUIDE.md`
3. Inspect server actions in `cartActions.ts`
4. Check database schema in `schema.prisma`

---

**Status**: ✅ Fully Implemented and Ready to Use!
