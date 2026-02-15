# Cart System - Quick Implementation Guide

## What Was Changed

### ✅ Files Created

1. **`src/app/(user)/_actions/cartActions.ts`**
   - Server actions for cart management
   - Functions: `getCart()`, `addToCart()`, `removeFromCart()`, `clearCart()`, `createDemandeFromCart()`, `getCartCount()`

2. **`src/components/cart/CartButton.tsx`**
   - Reusable cart button component with badge
   - Shows cart count and navigates to courses page

3. **`CART_SYSTEM_DOCUMENTATION.md`**
   - Complete documentation for the cart system

### ✅ Files Modified

1. **`src/components/newDash/ExplorePage.tsx`**
   - Replaced local state cart with persistent database cart
   - Updated to use server actions for add/remove operations
   - Now receives `initialCart` prop from server

2. **`src/app/(user)/dashboard/courses/page.tsx`**
   - Added cart fetching with `getCart()`
   - Passes cart data to `ExplorePage` component

## How It Works Now

### Before (Static Cart)

```
User adds grade → Stored in React state → Lost on page refresh
```

### After (Dynamic Cart)

```
User adds grade → Server action → Database → Persists forever
```

## Testing the Cart

### 1. Add Items to Cart

1. Navigate to `/dashboard/courses`
2. Click "Ajouter" on any grade card
3. The grade is added to your cart in the database
4. Cart count badge updates automatically

### 2. View Cart

1. Click "Ma Sélection" button (top right)
2. Side panel opens showing all cart items
3. You can remove items by clicking the trash icon

### 3. Submit Demande

1. Add one or more grades to cart
2. Click "Ma Sélection" to open cart
3. Click "Soumettre ma Demande"
4. A `DemandeInscription` is created with status `PENDING`
5. Cart is automatically cleared

### 4. Cart Persistence

1. Add items to cart
2. Close browser or navigate away
3. Come back later
4. Cart items are still there! 🎉

## Common Use Cases

### Show Cart Count in Navigation

```tsx
// In your navigation component
import { getCartCount } from "@/app/(user)/_actions/cartActions";
import CartButton from "@/components/cart/CartButton";

export default async function Navigation() {
  const { count } = await getCartCount();

  return (
    <nav>
      <CartButton cartCount={count} />
    </nav>
  );
}
```

### Add to Cart from Any Component

```tsx
"use client";
import { addToCart } from "@/app/(user)/_actions/cartActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function MyComponent({ grade }) {
  const router = useRouter();

  const handleAdd = async () => {
    const result = await addToCart(grade.id);
    if (result.success) {
      toast.success("Ajouté au panier!");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return <button onClick={handleAdd}>Ajouter</button>;
}
```

### Display Cart Summary

```tsx
// Server component
import { getCart } from "@/app/(user)/_actions/cartActions";

export default async function CartSummary() {
  const { cart } = await getCart();

  const total =
    cart?.items?.reduce((sum, item) => sum + item.priceAtAdd, 0) || 0;

  return (
    <div>
      <h3>Panier ({cart?.items?.length || 0} articles)</h3>
      <p>Total: {total} MAD</p>
    </div>
  );
}
```

## Validation Rules

The cart system automatically validates:

1. ✅ **User Authentication**: Must be logged in
2. ✅ **Grade Ownership**: Cannot add grades you already own
3. ✅ **Pending Demande**: Cannot add to cart if you have a pending demande
4. ✅ **Duplicate Items**: Cannot add same grade twice
5. ✅ **Grade Exists**: Validates grade exists in database

## Database Structure

Your cart data is stored in two tables:

**Cart Table:**

- `id`: Unique cart ID
- `userId`: User who owns the cart (unique)
- `createdAt`, `updatedAt`: Timestamps

**CartItem Table:**

- `id`: Unique item ID
- `cartId`: Reference to cart
- `gradeId`: Reference to grade
- `priceAtAdd`: Price when added (snapshot)
- `addedAt`: When item was added

## Next Steps

### Recommended Enhancements

1. **Add Cart to Dashboard**

   ```tsx
   // In dashboard, show cart summary
   import { getCart } from "@/app/(user)/_actions/cartActions";

   const { cart } = await getCart();
   // Display cart summary widget
   ```

2. **Add Cart to Navigation**

   ```tsx
   // Show cart count badge in header
   import CartButton from "@/components/cart/CartButton";
   import { getCartCount } from "@/app/(user)/_actions/cartActions";

   const { count } = await getCartCount();
   <CartButton cartCount={count} />;
   ```

3. **Add Cart Notifications**
   ```tsx
   // Notify users when cart items are about to expire (optional)
   // Or when prices change
   ```

## Troubleshooting

### Issue: Cart not updating after add/remove

**Solution**: Make sure you call `router.refresh()` after cart operations

```tsx
const result = await addToCart(gradeId);
if (result.success) {
  router.refresh(); // ← Don't forget this!
}
```

### Issue: Cart shows old data

**Solution**: The page needs to fetch cart data on load

```tsx
// In your page.tsx
const cartResult = await getCart();
const cart = cartResult.success ? cartResult.cart : null;

// Pass to component
<MyComponent initialCart={cart} />;
```

### Issue: Cannot add to cart

**Solution**: Check these conditions:

1. User is authenticated
2. User doesn't already own the grade
3. User doesn't have a pending demande
4. Grade exists in database

## API Reference

See `CART_SYSTEM_DOCUMENTATION.md` for complete API reference and detailed examples.

## Questions?

Check the main documentation file or review:

- `src/app/(user)/_actions/cartActions.ts` - Server actions
- `src/components/newDash/ExplorePage.tsx` - Usage example
- `prisma/schema.prisma` - Database models
