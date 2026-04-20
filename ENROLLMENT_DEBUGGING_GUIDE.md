# Debugging Enrollment Issue - Complete Guide

## Problem

Student registration and login appear to work, but enrollment fails with "Only students can enroll in courses"

## What Was Fixed

Added **comprehensive logging** at every step of the authentication and enrollment flow to pinpoint the exact issue.

## New Console Logs Added

### Registration (`authController.js`)

```
📝 Registration Request - Name: [name], Email: [email], Role: [role], Role Type: [type]
✅ User registered - Name: [name], Role: [role], ID: [id]
```

### Login (`authController.js`)

```
🔑 Login successful - User: [name], ID: [id], Role: [role]
✅ JWT token generated - Contains ID: [id], Role: [role]
```

### Authentication Middleware (`authMiddleware.js`)

```
🔐 Auth: Decoded ID: [id], Decoded Role: [role]
✅ Auth: User found: [name], Role: [role]
```

### Enrollment Check (`courseRoutes.js`)

```
🔐 Enrollment Validation - Authenticated User: [name] ([id])
🔍 Role Check - User: [name], Role: [role], Role Type: [type]
⚠️  Non-student attempted enrollment: [name] (Role: [role])
```

## Step-by-Step Debugging

### Step 1: Check Backend Console During Registration

1. Open terminal where backend is running
2. Register a new student
3. Look for this log:
   ```
   📝 Registration Request - Name: John, Email: john@test.com, Role: student, Role Type: string
   ✅ User registered - Name: John, Role: student, ID: 65f9d2...
   ```
4. **If you see this**: ✅ Registration is working correctly

### Step 2: Check Backend Console During Login

1. Same terminal
2. Log in with the student account you just registered
3. Look for this log:
   ```
   🔑 Login successful - User: John, ID: 65f9d2..., Role: student
   ✅ JWT token generated - Contains ID: 65f9d2..., Role: student
   ```
4. **If you see this**: ✅ Login is working correctly and token has role

### Step 3: Check Authentication Middleware

1. After login, navigate to any page that makes an API call
2. Look for logs like:
   ```
   🔐 Auth: Decoded ID: 65f9d2..., Decoded Role: student
   ✅ Auth: User found: John, Role: student
   ```
3. **If you see this**: ✅ Authentication middleware is working correctly

### Step 4: Try Enrollment and Check Role Check

1. Click "Enroll in Course"
2. Look for these logs:
   ```
   🔐 Enrollment Validation - Authenticated User: John (65f9d2...)
   🔍 Role Check - User: John, Role: student, Role Type: string
   ✅ Student John successfully enrolled in course Course Title
   ```
3. **If you see "Role: student"**: ✅ Everything is working

### Possible Issues and Solutions

#### Issue 1: Role is `undefined` or `null`

```
🔐 Enrollment Validation - Authenticated User: John (65f9d2...)
🔍 Role Check - User: John, Role: undefined, Role Type: undefined
⚠️  Non-student attempted enrollment: John (Role: undefined)
```

**Solution:**

- Check database directly to see if user role was saved
- Run this in MongoDB console:
  ```javascript
  db.users.findOne({ email: "student@test.com" });
  // Check if the "role" field exists and equals "student"
  ```
- If role is missing, re-register the user

#### Issue 2: Role is empty string `""`

```
🔍 Role Check - User: John, Role: , Role Type: string
```

**Solution:**

- The registration request might not be sending the role
- Check browser's Network tab during registration:
  - Right-click → Inspect → Network tab
  - Register a student
  - Look for POST request to `/api/auth/register`
  - Click it → Payload tab
  - Verify `"role": "student"` is included

#### Issue 3: Role is not exactly lowercase `"student"`

```
🔍 Role Check - User: John, Role: Student, Role Type: string
```

**Solution:**

- The User model expects lowercase `"student"` or `"teacher"`
- Frontend Register.jsx sends `"student"` lowercase
- If you see uppercase, check the option values in Register.jsx

#### Issue 4: User not found with ID

```
🔐 Auth: Decoded ID: 65f9d2..., Decoded Role: student
❌ Auth: User NOT found with ID: 65f9d2...
```

**Solution:**

- The JWT token has a valid ID, but user isn't in database
- This could mean:
  - User account was deleted
  - Database connection issue
  - Wrong MongoDB connection string
- Check that the same MongoDB instance is being used for registration and login

#### Issue 5: User role not defined (after user lookup)

```
✅ Auth: User found: John, Role: student
❌ Auth: User John has no role assigned
```

**Solution:**

- User exists but role field is not in the database document
- Run update to add role to existing users:
  ```javascript
  db.users.updateMany(
    { role: { $exists: false } },
    { $set: { role: "student" } },
  );
  ```

## Browser Developer Tools Check

### 1. Check if token is being saved

1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Look for `token` entry
4. It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Decode the JWT token

1. Go to https://jwt.io
2. Paste the token from localStorage
3. Check the Payload section
4. Should see:
   ```json
   {
     "id": "65f9d2...",
     "role": "student",
     "iat": 1234567890,
     "exp": 1234571490
   }
   ```
5. **If role is not there**: Token wasn't generated with role

### 3. Check Network Request

1. Try to enroll in a course
2. In DevTools → Network tab
3. Look for POST request to `/api/courses/{id}/enroll`
4. Click it → Headers tab
5. Verify `Authorization: Bearer eyJhbGci...` is present
6. Click → Response tab
7. See what error is returned

## Command Line Debugging

### MongoDB Check

```bash
# Connect to MongoDB
mongosh mongodb://127.0.0.1:27017/syncademyDB

# Find user and check role
db.users.findOne({email: "student@test.com"})

# Output should show:
# {
#   _id: ObjectId("..."),
#   name: "Student Name",
#   email: "student@test.com",
#   role: "student",        # <- Must be exactly "student"
#   ...
# }
```

### Backend Environment Check

```bash
# In backend directory
echo $JWT_SECRET  # Should show: 6d8f0e2b9c7a...
echo $MONGO_URI   # Should show: mongodb://127.0.0.1:27017/syncademyDB
```

## Complete Debug Checklist

Before enrollment:

- [ ] Backend console shows `✅ User registered` during registration
- [ ] Backend console shows `🔑 Login successful` during login
- [ ] JWT token is in localStorage (DevTools → Application)
- [ ] JWT token contains `"role": "student"` (jwt.io decoding)
- [ ] MongoDB shows user has `role: "student"` (mongosh query)

During enrollment:

- [ ] Backend console shows `🔐 Enrollment Validation` log
- [ ] Backend console shows `🔍 Role Check` with `Role: student`
- [ ] Backend console shows `✅ Student successfully enrolled`
- [ ] Email notification sent (check email inbox or server logs)

## If Still Having Issues

1. **Stop backend**: Ctrl+C in terminal
2. **Clear database**:
   ```bash
   mongosh mongodb://127.0.0.1:27017/syncademyDB
   db.users.deleteMany({})
   db.courses.updateMany({}, {$set: {students: []}})
   exit
   ```
3. **Restart backend**: `npm run dev`
4. **Clear browser cache**: DevTools → Application → Clear site data
5. **Register fresh test account**
6. **Check all logs carefully**

## Expected Successful Flow

```
TERMINAL 1 (Backend):
📝 Registration Request - Name: TestStudent, Email: test@test.com, Role: student, Role Type: string
✅ User registered - Name: TestStudent, Role: student, ID: 65f9d200...

(User logs in)

🔑 Login successful - User: TestStudent, ID: 65f9d200..., Role: student
✅ JWT token generated - Contains ID: 65f9d200..., Role: student

(User navigates to course)

🔐 Auth: Decoded ID: 65f9d200..., Decoded Role: student
✅ Auth: User found: TestStudent, Role: student
🔍 Course Check - User: TestStudent (65f9d200...), Course: ..., Enrolled: false

(User clicks "Enroll Now")

🔐 Enrollment Validation - Authenticated User: TestStudent (65f9d200...)
🔍 Role Check - User: TestStudent, Role: student, Role Type: string
✅ Student TestStudent successfully enrolled in course ...
📧 Teacher: TeacherName (teacher@test.com)
📬 Notification created for teacher TeacherName
✉️  Email sent to teacher@test.com
```

If you see this entire flow, everything is working! ✅
