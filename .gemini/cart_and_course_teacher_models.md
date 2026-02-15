# Cart and Course-Teacher Models Documentation

## Overview

This document describes the new database models added to support:

1. **Shopping Cart**: Allow users to add grades to a cart before creating a demande
2. **Course-Teacher Assignment**: Link teachers to specific courses (many-to-many relationship)

## Cart Models

### Cart Model

Represents a user's shopping cart for grades.

```prisma
model Cart {
  id     String @id @default(cuid())
  userId String @unique // One cart per user

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[] // Cart items (grades in the cart)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

**Features:**

- Each user has exactly one cart (one-to-one relationship)
- Cart is automatically deleted when user is deleted (cascade)
- Tracks creation and update timestamps

### CartItem Model

Junction table for Cart-Grade many-to-many relationship.

```prisma
model CartItem {
  id      String @id @default(cuid())
  cartId  String
  gradeId String

  cart  Cart  @relation(fields: [cartId], references: [id], onDelete: Cascade)
  grade Grade @relation(fields: [gradeId], references: [id], onDelete: Cascade)

  priceAtAdd Int // Store the price at the time of adding to cart
  addedAt DateTime @default(now())

  @@unique([cartId, gradeId]) // A grade can only be in a cart once
  @@index([cartId])
  @@index([gradeId])
}
```

**Features:**

- Links carts to grades
- Stores the price at the time of adding (in case price changes later)
- Prevents duplicate grades in the same cart
- Tracks when item was added to cart

### Usage Examples

#### Create or Get User's Cart

```typescript
// Get or create cart for a user
const cart = await prisma.cart.upsert({
  where: { userId: userId },
  create: {
    userId: userId,
  },
  update: {},
  include: {
    items: {
      include: {
        grade: true,
      },
    },
  },
});
```

#### Add Grade to Cart

```typescript
// Add a grade to user's cart
const cartItem = await prisma.cartItem.create({
  data: {
    cartId: cart.id,
    gradeId: gradeId,
    priceAtAdd: grade.price, // Store current price
  },
  include: {
    grade: true,
  },
});
```

#### Remove Grade from Cart

```typescript
// Remove a grade from cart
await prisma.cartItem.delete({
  where: {
    cartId_gradeId: {
      cartId: cart.id,
      gradeId: gradeId,
    },
  },
});
```

#### Get Cart with Total Price

```typescript
// Get cart with all items and calculate total
const cart = await prisma.cart.findUnique({
  where: { userId: userId },
  include: {
    items: {
      include: {
        grade: true,
      },
    },
  },
});

const totalPrice =
  cart?.items.reduce((sum, item) => sum + item.priceAtAdd, 0) || 0;
```

#### Clear Cart

```typescript
// Clear all items from cart
await prisma.cartItem.deleteMany({
  where: { cartId: cart.id },
});
```

## Course-Teacher Models

### CourseTeacher Model

Junction table for Course-Teacher many-to-many relationship.

```prisma
model CourseTeacher {
  id        String   @id @default(cuid())
  teacherId String
  courseId  String
  createdAt DateTime @default(now())

  teacher User   @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  course  Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([teacherId, courseId]) // A teacher can only be assigned to a course once
  @@index([teacherId])
  @@index([courseId])
}
```

**Features:**

- Links teachers (users with TEACHER role) to specific courses
- A teacher can be assigned to multiple courses
- A course can have multiple teachers
- Prevents duplicate assignments
- Tracks when teacher was assigned

### Updated Models

#### Course Model

```prisma
model Course {
  // ... existing fields
  teachers   CourseTeacher[]     // Teachers assigned to this course
}
```

#### User Model

```prisma
model User {
  // ... existing fields
  courseTeachers     CourseTeacher[]  // Courses where user is a teacher
  cart               Cart?            // User's shopping cart
}
```

### Usage Examples

#### Assign Teacher to Course

```typescript
// Assign a teacher to a course
const assignment = await prisma.courseTeacher.create({
  data: {
    teacherId: teacherId,
    courseId: courseId,
  },
  include: {
    teacher: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    course: {
      select: {
        id: true,
        title: true,
      },
    },
  },
});
```

#### Get All Teachers for a Course

```typescript
// Get all teachers assigned to a course
const courseWithTeachers = await prisma.course.findUnique({
  where: { id: courseId },
  include: {
    teachers: {
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    },
  },
});

const teachers = courseWithTeachers?.teachers.map((ct) => ct.teacher) || [];
```

#### Get All Courses for a Teacher

```typescript
// Get all courses assigned to a teacher
const teacherWithCourses = await prisma.user.findUnique({
  where: { id: teacherId },
  include: {
    courseTeachers: {
      include: {
        course: {
          include: {
            subject: true,
          },
        },
      },
    },
  },
});

const courses = teacherWithCourses?.courseTeachers.map((ct) => ct.course) || [];
```

#### Remove Teacher from Course

```typescript
// Remove a teacher from a course
await prisma.courseTeacher.delete({
  where: {
    teacherId_courseId: {
      teacherId: teacherId,
      courseId: courseId,
    },
  },
});
```

#### Check if Teacher is Assigned to Course

```typescript
// Check if a teacher is assigned to a course
const assignment = await prisma.courseTeacher.findUnique({
  where: {
    teacherId_courseId: {
      teacherId: teacherId,
      courseId: courseId,
    },
  },
});

const isAssigned = assignment !== null;
```

## Migration

To apply these schema changes to your database, run:

```bash
npx prisma migrate dev --name add_cart_and_course_teacher
```

This will:

1. Create the `Cart` table
2. Create the `CartItem` table
3. Create the `CourseTeacher` table
4. Add the necessary foreign keys and indexes
5. Update the Prisma Client

## Next Steps

### For Cart Implementation:

1. Create server actions in `src/actions/cart.ts` for cart operations
2. Create a cart UI component to display cart items
3. Add "Add to Cart" buttons on grade selection pages
4. Implement checkout flow to create DemandeInscription from cart

### For Course-Teacher Implementation:

1. Create server actions in `src/actions/course-teachers.ts`
2. Add UI in admin panel to assign teachers to courses
3. Update course display to show assigned teachers
4. Add teacher dashboard to show their assigned courses
