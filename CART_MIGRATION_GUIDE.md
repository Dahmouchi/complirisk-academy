# Cart System Migration Guide

## 🔄 Migrating from Static to Dynamic Cart

This guide helps you migrate any existing code that might be using the old static cart pattern to the new dynamic cart system.

---

## Before vs After

### ❌ Before (Static Cart - Don't use this anymore)

```tsx
// OLD WAY - Local state cart
"use client";
import { useState } from "react";

export default function OldCartComponent() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]); // Lost on refresh!
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### ✅ After (Dynamic Cart - Use this)

```tsx
// NEW WAY - Persistent cart with server actions
"use client";
import { addToCart, removeFromCart } from "@/app/(user)/_actions/cartActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function NewCartComponent({ initialCart }) {
  const router = useRouter();

  const handleAdd = async (gradeId) => {
    const result = await addToCart(gradeId);
    if (result.success) {
      toast.success("Ajouté au panier!");
      router.refresh(); // Updates cart from database
    } else {
      toast.error(result.error);
    }
  };

  const handleRemove = async (gradeId) => {
    const result = await removeFromCart(gradeId);
    if (result.success) {
      toast.success("Retiré du panier!");
      router.refresh();
    }
  };

  return (
    <div>
      {initialCart?.items?.map((item) => (
        <div key={item.id}>
          {item.grade.name}
          <button onClick={() => handleRemove(item.gradeId)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Migration Steps

### Step 1: Update Imports

**Before:**

```tsx
import { useState } from "react";
```

**After:**

```tsx
import {
  addToCart,
  removeFromCart,
  getCart,
} from "@/app/(user)/_actions/cartActions";
import { useRouter } from "next/navigation";
```

---

### Step 2: Remove Local State

**Before:**

```tsx
const [cart, setCart] = useState([]);
```

**After:**

```tsx
// Cart comes from server as prop
export default function MyComponent({ initialCart }) {
  const cart = initialCart?.items || [];
  // ...
}
```

---

### Step 3: Update Add to Cart

**Before:**

```tsx
const addToCart = (item) => {
  setCart([...cart, item]);
};
```

**After:**

```tsx
const router = useRouter();

const handleAddToCart = async (gradeId) => {
  const result = await addToCart(gradeId);
  if (result.success) {
    toast.success("Ajouté!");
    router.refresh();
  } else {
    toast.error(result.error);
  }
};
```

---

### Step 4: Update Remove from Cart

**Before:**

```tsx
const removeFromCart = (id) => {
  setCart(cart.filter((item) => item.id !== id));
};
```

**After:**

```tsx
const handleRemoveFromCart = async (gradeId) => {
  const result = await removeFromCart(gradeId);
  if (result.success) {
    toast.success("Retiré!");
    router.refresh();
  } else {
    toast.error(result.error);
  }
};
```

---

### Step 5: Fetch Cart in Server Component

**Before:**

```tsx
// No server-side cart fetching
export default function Page() {
  return <CartComponent />;
}
```

**After:**

```tsx
import { getCart } from "@/app/(user)/_actions/cartActions";

export default async function Page() {
  const { cart } = await getCart();

  return <CartComponent initialCart={cart} />;
}
```

---

## Common Patterns

### Pattern 1: Display Cart Count

**Before:**

```tsx
const cartCount = cart.length;
```

**After:**

```tsx
// In server component
import { getCartCount } from "@/app/(user)/_actions/cartActions";

const { count } = await getCartCount();
```

---

### Pattern 2: Calculate Total Price

**Before:**

```tsx
const total = cart.reduce((sum, item) => sum + item.price, 0);
```

**After:**

```tsx
const total =
  initialCart?.items?.reduce((sum, item) => sum + item.priceAtAdd, 0) || 0;
```

---

### Pattern 3: Check if Item in Cart

**Before:**

```tsx
const isInCart = cart.some((item) => item.id === gradeId);
```

**After:**

```tsx
const isInCart =
  initialCart?.items?.some((item) => item.gradeId === gradeId) || false;
```

---

### Pattern 4: Clear Cart

**Before:**

```tsx
const clearCart = () => {
  setCart([]);
};
```

**After:**

```tsx
import { clearCart } from "@/app/(user)/_actions/cartActions";

const handleClearCart = async () => {
  const result = await clearCart();
  if (result.success) {
    toast.success("Panier vidé!");
    router.refresh();
  }
};
```

---

## Data Structure Changes

### Old Cart Item Structure

```typescript
{
  id: string;
  name: string;
  price: number;
  // ... other grade fields
}
```

### New Cart Item Structure

```typescript
{
  id: string;              // CartItem ID
  gradeId: string;         // Grade ID
  priceAtAdd: number;      // Price when added
  addedAt: Date;           // When added
  grade: {                 // Full grade object
    id: string;
    name: string;
    price: number;
    niveau: {...};
    subjects: [...];
  }
}
```

### Accessing Data

**Before:**

```tsx
cart.map((item) => (
  <div>
    {item.name} - {item.price} MAD
  </div>
));
```

**After:**

```tsx
initialCart?.items?.map((item) => (
  <div>
    {item.grade.name} - {item.priceAtAdd} MAD
  </div>
));
```

---

## Error Handling

### Before (No error handling)

```tsx
const addToCart = (item) => {
  setCart([...cart, item]);
  // No validation, no error handling
};
```

### After (Proper error handling)

```tsx
const handleAddToCart = async (gradeId) => {
  try {
    const result = await addToCart(gradeId);

    if (result.success) {
      toast.success("Ajouté au panier!");
      router.refresh();
    } else {
      // Handle specific errors
      if (result.error?.includes("déjà")) {
        toast.info("Déjà dans votre panier");
      } else {
        toast.error(result.error || "Erreur");
      }
    }
  } catch (error) {
    console.error("Cart error:", error);
    toast.error("Une erreur s'est produite");
  }
};
```

---

## Loading States

### Add Loading Indicator

```tsx
"use client";
import { useState, useTransition } from "react";

export default function CartComponent({ initialCart }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = async (gradeId) => {
    startTransition(async () => {
      const result = await addToCart(gradeId);
      if (result.success) {
        toast.success("Ajouté!");
        router.refresh();
      }
    });
  };

  return (
    <button onClick={() => handleAddToCart(grade.id)} disabled={isPending}>
      {isPending ? "Ajout..." : "Ajouter"}
    </button>
  );
}
```

---

## Optimistic Updates (Advanced)

For better UX, you can show immediate feedback:

```tsx
"use client";
import { useState, useTransition, useOptimistic } from "react";

export default function CartComponent({ initialCart }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCart, addOptimisticItem] = useOptimistic(
    initialCart?.items || [],
    (state, newItem) => [...state, newItem],
  );

  const handleAddToCart = async (grade) => {
    // Immediately show in UI
    addOptimisticItem({
      id: `temp-${Date.now()}`,
      gradeId: grade.id,
      grade: grade,
      priceAtAdd: grade.price,
    });

    // Then update database
    startTransition(async () => {
      const result = await addToCart(grade.id);
      if (result.success) {
        router.refresh(); // Get real data
      } else {
        toast.error(result.error);
        // Optimistic update will be reverted by refresh
      }
    });
  };

  return (
    <div>
      {optimisticCart.map((item) => (
        <div key={item.id}>{item.grade.name}</div>
      ))}
    </div>
  );
}
```

---

## Testing Migration

### Checklist

- [ ] Remove all `useState` for cart
- [ ] Replace with server actions
- [ ] Add `router.refresh()` after mutations
- [ ] Update data access (item.grade.name instead of item.name)
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test add to cart
- [ ] Test remove from cart
- [ ] Test cart persistence
- [ ] Test validation errors

---

## Common Mistakes

### ❌ Mistake 1: Forgetting router.refresh()

```tsx
// WRONG - Cart won't update
const result = await addToCart(gradeId);
if (result.success) {
  toast.success("Added!");
  // Missing router.refresh()!
}
```

```tsx
// CORRECT
const result = await addToCart(gradeId);
if (result.success) {
  toast.success("Added!");
  router.refresh(); // ✓
}
```

---

### ❌ Mistake 2: Wrong data access

```tsx
// WRONG - item.name doesn't exist
cart.items.map((item) => item.name);
```

```tsx
// CORRECT - access through grade object
cart.items.map((item) => item.grade.name);
```

---

### ❌ Mistake 3: Not handling async

```tsx
// WRONG - Not awaiting
const handleAdd = () => {
  addToCart(gradeId); // Missing await!
  router.refresh();
};
```

```tsx
// CORRECT
const handleAdd = async () => {
  const result = await addToCart(gradeId);
  if (result.success) {
    router.refresh();
  }
};
```

---

### ❌ Mistake 4: Using in client without server data

```tsx
// WRONG - No initial cart data
"use client";
export default function MyPage() {
  // Cart data not fetched!
  return <CartComponent />;
}
```

```tsx
// CORRECT - Fetch in server component
// page.tsx (server component)
import { getCart } from "@/app/(user)/_actions/cartActions";

export default async function MyPage() {
  const { cart } = await getCart();
  return <CartComponent initialCart={cart} />;
}
```

---

## Performance Tips

### 1. Memoize Cart Calculations

```tsx
import { useMemo } from "react";

const totalPrice = useMemo(() => {
  return (
    initialCart?.items?.reduce((sum, item) => sum + item.priceAtAdd, 0) || 0
  );
}, [initialCart]);
```

### 2. Debounce Multiple Operations

```tsx
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();

// Prevents multiple simultaneous operations
const handleAdd = (gradeId) => {
  if (isPending) return;

  startTransition(async () => {
    await addToCart(gradeId);
    router.refresh();
  });
};
```

---

## Summary

### Key Changes

1. **State Management**: Local state → Database
2. **Operations**: Synchronous → Asynchronous (server actions)
3. **Data Flow**: Client-only → Server + Client
4. **Persistence**: Session-only → Permanent
5. **Validation**: Client-side → Server-side

### Benefits

✅ Cart persists across sessions
✅ Better data integrity
✅ Server-side validation
✅ Scalable architecture
✅ Better security

---

## Need Help?

1. Check `CART_README.md` for overview
2. Review `CART_SYSTEM_DOCUMENTATION.md` for API details
3. See `ExplorePage.tsx` for working example
4. Check server actions in `cartActions.ts`

---

**Migration Status**: ✅ Complete Guide

Your cart system is now fully migrated to the dynamic, persistent model!
