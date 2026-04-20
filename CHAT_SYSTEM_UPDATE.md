# Chat System Update Documentation

## Overview

The chat system has been updated to support group course chat with real-time notifications. This document outlines the changes made and how the system works.

---

## What's New

### 1. **Group Course Chat**

- Teachers can chat with all approved students in their course group
- Students can chat with all other students in the same course group
- All participants see the same conversation in real-time

### 2. **Notification System**

Messages now trigger notifications to all relevant parties:

#### When a **Teacher** sends a message:

- Notification sent to all **approved students** in the course
- Notification stored in database for offline users
- Real-time notification via Socket.IO for online users

#### When a **Student** sends a message:

- Notification sent to the **teacher** of the course
- Notification sent to all **other approved students** in the course
- Notifications stored for offline users
- Real-time notifications via Socket.IO for online users

### 3. **Chat Access Control** (Already Secured)

- **Teachers** can only chat in their own courses
- **Students** can only chat in courses where they have **approved enrollment**
- All message sending is verified on the backend

---

## Technical Implementation

### Backend Changes

#### 1. **Chat Controller** (`backend/controllers/chatController.js`)

**Updated `saveMessage` function:**

```javascript
- Imports Notification model
- Creates notifications after saving each message
- Notification recipients determined by sender role:
  * If teacher: notifies all approved students
  * If student: notifies teacher + other approved students
- Notifications include:
  * Title: Course name or sender info
  * Message preview (50 chars + "...")
  * Action URL to navigate to chat
  * Message type for filtering
```

**Key Features:**

- Notification creation is wrapped in try-catch to ensure message save isn't affected if notification fails
- Proper error logging without breaking the message send operation
- Prevents duplicate notifications by calculating eligible recipients

#### 2. **Socket.IO Handler** (`backend/socket/courseChat.js`)

**Updated `send_message` handler:**

```javascript
- Now async to support database lookups
- Imports Course and EnrollmentRequest models
- After broadcasting message, triggers notification emission
- Emits new_notification event to target users
- Notifications sent via Socket.IO for real-time delivery
```

**Notification Flow:**

1. Message is saved to database
2. Message is broadcast to all users in the course room
3. Eligible recipients are identified
4. Notifications are emitted via Socket.IO to online users
5. Database notifications ensure offline users see it later

**Socket Events:**

- `receive_message` - All users in room receive the message
- `message_sent` - Sender gets confirmation
- `new_notification` - Eligible recipients get real-time notification

### Data Models (No Changes Required)

**ChatMessage Model** - Already supports:

- Course reference
- Sender information
- Timestamp
- readBy tracking

**Notification Model** - Already supports:

- Recipient
- Message type (enum includes 'message')
- Related course reference
- Read status
- Action URL

---

## Usage Flow

### For Teachers

1. **Send a message:**

   ```javascript
   // Via REST API
   POST /api/chat/course/:courseId/send
   Body: { message: "Hello students!" }

   // Via Socket.IO
   socket.emit('send_message', {
     courseId: '...',
     message: 'Hello students!',
     userId: '...',
     userName: 'Teacher Name',
     role: 'teacher'
   })
   ```

2. **Receive notifications:**
   - When a student sends a message
   - Appears in notification system
   - Real-time notification via Socket.IO

3. **View course chat:**

   ```javascript
   GET /api/chat/course/:courseId
   // Returns all messages with full details

   GET /api/chat/course/:courseId/approved-students
   // Lists all approved students in the course
   ```

### For Students

1. **Join course chat:**

   ```javascript
   // Requires approved enrollment
   socket.emit("join_course_chat", {
     courseId: "...",
     role: "student",
     userId: "...",
     userName: "Student Name",
   });
   ```

2. **Send a message:**

   ```javascript
   socket.emit("send_message", {
     courseId: "...",
     message: "Question about the course",
     userId: "...",
     userName: "Student Name",
     role: "student",
   });
   ```

3. **Receive messages:**
   - From teacher
   - From other students in same course
   - All appear in same chat room

4. **Get enrolled courses:**
   ```javascript
   GET / api / chat / student / enrolled - courses;
   // Lists all courses with approved enrollment
   ```

---

## Authorization & Security

### Route Protection

- All chat routes require authentication (`protect` middleware)
- JWT token verification on all requests

### Message Sending Authorization

**Teacher:**

- Must own the course (verified in saveMessage)
- Returns 403 if not the course teacher

**Student:**

- Must have approved enrollment (verified in saveMessage)
- Checks EnrollmentRequest status === 'approved'
- Returns 403 if not approved

### Group Access Control

- Students can only see chat for courses they're enrolled in
- Teachers can only chat in their own courses
- Notifications only sent to eligible participants

### Notification Recipients (Auto-filtered)

- **Teacher sending:** Only approved students receive notification
- **Student sending:** Teacher + other approved students (not sender)
- Prevents notifications to unauthorized users

---

## Database Records

### ChatMessage Schema

```javascript
{
  course: ObjectId,        // Course reference
  sender: ObjectId,        // User who sent message
  senderName: String,      // Cache sender name
  senderRole: String,      // "teacher" or "student"
  message: String,         // Message content
  timestamp: Date,         // When sent
  readBy: [{               // Track who read it
    userId: ObjectId,
    readAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema (Used)

```javascript
{
  recipient: ObjectId,       // User receiving notification
  title: String,             // e.g., "New message from John"
  message: String,           // Preview of message
  type: String,              // "message"
  relatedCourse: ObjectId,   // Course the message is from
  isRead: Boolean,           // default: false
  actionUrl: String,         // e.g., "/course/:courseId/chat"
  createdAt: Date,
  updatedAt: Date
}
```

---

## Real-Time Event Diagram

```
[User A Sends Message]
         |
         v
[Backend receives via Socket]
         |
    +----+----+
    |         |
    v         v
[Save to DB] [Broadcast to Room]
    |         |
    v         |
[Create       v
 Notifs] [All users see message]
    |
    v
[Emit new_notification event]
    |
    v
[Online Users see notification
 Offline Users get it later]
```

---

## Existing Logic Preserved

✅ **No Breaking Changes:**

- Message storage logic unchanged
- Chat message retrieval works the same
- Read status tracking unaffected
- Course authorization same
- Socket room structure preserved
- User join/leave events unchanged
- Typing indicators functional

✅ **Backward Compatible:**

- Clients can ignore `new_notification` events if not implemented
- Message sending works with or without Socket.IO
- Notifications optional - database messages still received via REST API

---

## Testing Recommendations

### Test Case 1: Teacher to Student Chat

1. Teacher sends message in course chat
2. All approved students receive notification
3. Unapproved students don't receive notification
4. Teacher can see all student messages

### Test Case 2: Student to Student Chat

1. Student A sends message
2. Student B and Teacher receive notification
3. Other students in course see message in room
4. Message appears in database

### Test Case 3: Authorization

1. Non-enrolled student cannot join chat (403)
2. Non-course teacher cannot send message (403)
3. Approved student can chat (200)
4. Course teacher can chat (200)

### Test Case 4: Real-time Notifications

1. Send message with Socket.IO
2. Online users receive notification event immediately
3. Offline users find notification in database later
4. Notification includes proper metadata

### Test Case 5: Notification Content

1. Verify notification titles are appropriate
2. Check message previews truncate correctly
3. Action URLs redirect to correct course chat
4. Created timestamp is accurate

---

## API Endpoints Summary

| Method | Endpoint                                       | Auth | Purpose                              |
| ------ | ---------------------------------------------- | ---- | ------------------------------------ |
| GET    | `/api/chat/course/:courseId`                   | ✓    | Get all chat messages for a course   |
| GET    | `/api/chat/course/:courseId/approved-students` | ✓    | Get approved students (teacher only) |
| GET    | `/api/chat/student/enrolled-courses`           | ✓    | Get enrolled courses (student only)  |
| POST   | `/api/chat/course/:courseId/send`              | ✓    | Send a new message                   |
| PUT    | `/api/chat/course/:courseId/mark-read`         | ✓    | Mark messages as read                |

---

## Socket Events Summary

| Event              | Sender          | Purpose                                 |
| ------------------ | --------------- | --------------------------------------- |
| `join_course_chat` | Client → Server | Join a course chat room                 |
| `send_message`     | Client → Server | Send a message (triggers notifications) |
| `receive_message`  | Server → Room   | Broadcast message to room               |
| `message_sent`     | Server → Sender | Confirm message sent                    |
| `new_notification` | Server → Users  | Send real-time notification             |
| `user_joined`      | Server → Room   | Notify others user joined               |
| `user_left`        | Server → Room   | Notify others user left                 |
| `typing`           | Client → Server | Broadcast typing indicator              |
| `user_typing`      | Server → Room   | Show typing indicator                   |
| `stop_typing`      | Client → Server | Clear typing indicator                  |

---

## Notes

- Notifications are sent both via Socket.IO (real-time) and database (persistent)
- If Socket.IO fails, notifications still saved in database
- If database fails, Socket.IO notifications still delivered to online users
- System is resilient to partial failures
- No breaking changes to existing functionality
- All existing routes and events continue to work
