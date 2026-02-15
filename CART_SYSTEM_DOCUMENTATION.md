# Dynamic Cart System - Documentation

## Overview

The cart system has been upgraded from a static, local-state implementation to a **dynamic, persistent cart** that stores data in the database. Users can now add grades to their cart, and the cart persists across sessions.

## Features

✅ **Persistent Cart**: Cart data is stored in the database and persists across sessions
✅ **Add/Remove Items**: Users can add and remove grades from their cart
✅ **Price Tracking**: Prices are stored at the time of adding to cart
✅ **Create Demande**: Users can submit a demande (request) from their cart items
✅ **Validation**: Prevents adding already-owned grades or when pending demande exists
✅ **Real-time Updates**: Cart updates immediately with optimistic UI updates

## Database Schema

The cart uses two models from your Prisma schema:

```prisma
model Cart {
  id     String @id @default(cuid())
  userId String @unique // One cart per user
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  items  CartItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CartItem {
  id      String @id @default(cuid())
  cartId  String
  gradeId String
  cart    Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)
  grade   Grade  @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  priceAtAdd Int  // Price at time of adding
  addedAt DateTime @default(now())
  @@unique([cartId, gradeId])
}
```

## Server Actions

All cart operations are handled by server actions in `src/app/(user)/_actions/cartActions.ts`:

### 1. `getCart()`

Fetches the user's cart with all items and grade details.

```typescript
const cartResult = await getCart();
if (cartResult.success) {
  const cart = cartResult.cart;
  // cart.items contains all cart items with grade details
}
```

### 2. `addToCart(gradeId: string)`

Adds a grade to the user's cart.

```typescript
const result = await addToCart(gradeId);
if (result.success) {
  // Grade added successfully
} else {
  // Handle error: result.error
}
```

**Validations:**

- Checks if user already owns the grade
- Checks if user has a pending demande
- Checks if grade is already in cart
- Validates grade exists

### 3. `removeFromCart(gradeId: string)`

Removes a grade from the user's cart.

```typescript
const result = await removeFromCart(gradeId);
```

### 4. `clearCart()`

Removes all items from the user's cart.

```typescript
const result = await clearCart();
```

### 5. `createDemandeFromCart()`

Creates a demande (inscription request) from all items in the cart.

```typescript
const result = await createDemandeFromCart();
if (result.success) {
  // Demande created, cart is automatically cleared
}
```

**What it does:**

- Creates a `DemandeInscription` with status `PENDING`
- Creates `DemandeInscriptionGrade` entries for each cart item
- Calculates total price from cart items
- Automatically clears the cart after successful creation

### 6. `getCartCount()`

Gets the number of items in the user's cart (useful for badges).

```typescript
const { count } = await getCartCount();
```

## Usage Examples

### Example 1: Display Cart in a Page

```tsx
// In your page.tsx (Server Component)
import { getCart } from "@/app/(user)/_actions/cartActions";

export default async function MyPage() {
  const cartResult = await getCart();
  const cart = cartResult.success ? cartResult.cart : null;

  return (
    <div>
      <h1>My Cart ({cart?.items?.length || 0} items)</h1>
      {cart?.items?.map((item) => (
        <div key={item.id}>
          {item.grade.name} - {item.priceAtAdd} MAD
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Add to Cart from Client Component

```tsx
"use client";
import { addToCart } from "@/app/(user)/_actions/cartActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function GradeCard({ grade }) {
  const router = useRouter();

  const handleAddToCart = async () => {
    const result = await addToCart(grade.id);

    if (result.success) {
      toast.success(`${grade.name} ajouté au panier`);
      router.refresh(); // Refresh to show updated cart
    } else {
      toast.error(result.error);
    }
  };

  return <button onClick={handleAddToCart}>Ajouter au panier</button>;
}
```

### Example 3: Submit Demande from Cart

```tsx
"use client";
import { createDemandeFromCart } from "@/app/(user)/_actions/cartActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CheckoutButton() {
  const router = useRouter();

  const handleSubmit = async () => {
    const result = await createDemandeFromCart();

    if (result.success) {
      toast.success("Demande créée avec succès!");
      router.push("/dashboard"); // Redirect to dashboard
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return <button onClick={handleSubmit}>Soumettre ma demande</button>;
}
```

### Example 4: Using the CartButton Component

```tsx
// In any component
import CartButton from "@/components/cart/CartButton";
import { getCartCount } from "@/app/(user)/_actions/cartActions";

export default async function Navigation() {
  const { count } = await getCartCount();

  return (
    <nav>
      <CartButton cartCount={count} variant="outline" showLabel={true} />
    </nav>
  );
}
```

## Integration with ExplorePage

The `ExplorePage` component (`src/components/newDash/ExplorePage.tsx`) has been updated to use the persistent cart:

1. **Receives `initialCart` prop** from the server
2. **Transforms cart data** into a usable format
3. **Uses server actions** for add/remove operations
4. **Refreshes page** after cart operations to show updated data

```tsx
// In page.tsx
const cartResult = await getCart();
const cart = cartResult.success ? cartResult.cart : null;

<ExplorePage
  matieres={courses}
  user={user}
  pendingDemande={pendingDemande}
  initialCart={cart} // ← Pass cart data
/>;
```

## Flow Diagram

```
User Action → Server Action → Database → Revalidate → UI Update
     ↓              ↓             ↓           ↓            ↓
  Click Add → addToCart() → INSERT → refresh() → Show in cart
```

## Important Notes

1. **One Cart Per User**: Each user has exactly one cart
2. **Unique Items**: A grade can only be added to cart once
3. **Price Snapshot**: The price is stored when added to cart (in case prices change later)
4. **Auto-Clear**: Cart is automatically cleared when a demande is created
5. **Pending Demande**: Users cannot add to cart if they have a pending demande
6. **Already Owned**: Users cannot add grades they already own

## Error Handling

All server actions return a consistent response format:

```typescript
{
  success: boolean;
  error?: string;
  message?: string;
  // ... other data
}
```

Always check `success` before proceeding:

```typescript
const result = await addToCart(gradeId);
if (!result.success) {
  console.error(result.error);
  return;
}
// Proceed with success case
```

## Next Steps

To further enhance the cart system, you could:

1. **Add cart summary widget** to the dashboard
2. **Show cart count in navigation** header
3. **Add "View Cart" quick action** from any page
4. **Implement cart expiration** (optional)
5. **Add cart sharing** functionality (optional)
6. **Email notifications** when cart items go on sale (optional)

## Troubleshooting

### Cart not updating?

- Make sure you're calling `router.refresh()` after cart operations
- Check that the page is properly fetching cart data with `getCart()`

### Items disappearing from cart?

- Check if a demande was created (cart auto-clears)
- Verify database constraints are properly set

### Cannot add to cart?

- Check if user has a pending demande
- Verify the grade exists and user doesn't already own it
- Check browser console for error messages

## Support

For questions or issues, refer to:

- Server actions: `src/app/(user)/_actions/cartActions.ts`
- ExplorePage component: `src/components/newDash/ExplorePage.tsx`
- Database schema: `prisma/schema.prisma`
