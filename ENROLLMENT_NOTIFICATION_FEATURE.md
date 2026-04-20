# Course Enrollment Notification System

## Overview

This feature enables students to enroll in courses with automatic notifications to teachers. When a student enrolls, the teacher receives:

1. **In-app notification** - Visible in the teacher dashboard notification panel
2. **Email notification** - Sent to the teacher's email address

## What Was Implemented

### Backend Components

#### 1. **Notification Model** (`backend/models/Notification.js`)

- Stores all notifications with metadata
- Fields: recipient, title, message, type, relatedCourse, relatedStudent, isRead, actionUrl
- Timestamps automatically added

#### 2. **Email Service** (`backend/services/emailService.js`)

- Handles SMTP email sending via Nodemailer
- Sends beautifully formatted HTML emails
- Includes error handling and configuration verification
- Configurable via environment variables

#### 3. **Course Enrollment Endpoint** (`backend/routes/courseRoutes.js`)

- **POST** `/api/courses/:id/enroll`
- Creates notification in database
- Sends email to teacher
- Prevents duplicate enrollments
- Updates course enrollmentCount

#### 4. **Notification Routes** (`backend/routes/notificationRoutes.js`)

- **GET** `/api/notifications` - Fetch user's notifications
- **GET** `/api/notifications/unread/count` - Get unread count
- **PUT** `/api/notifications/:id/read` - Mark as read
- **DELETE** `/api/notifications/:id` - Delete notification
- All routes are protected (require authentication)

### Frontend Components

#### 1. **CourseDetail.jsx Updates**

- Added `enrolling` state for loading indicator
- Updated `handleEnroll` function with:
  - React Hot Toast notifications
  - Proper error handling
  - Auto-redirect to courses after successful enrollment
  - Loading state with spinner icon
- Enhanced enroll button with:
  - Loading state with animated spinner
  - Disabled state when already enrolled
  - Visual feedback during enrollment

#### 2. **TeacherDashboard.jsx Updates**

- Added `notifications` and `showNotifications` state
- Fetches notifications on component mount
- Auto-refreshes every 30 seconds
- Interactive notification bell button:
  - Shows unread count as red dot
  - Displays notification dropdown on click
  - Shows latest 10 notifications
  - Displays timestamp and message for each
  - Visual indicator for unread notifications
- Notification dropdown features:
  - Beautiful styled panel
  - Notification list with metadata
  - No-notifications empty state
  - Click-outside to close
  - Smooth animations

### Database Model

#### Notification Schema

```javascript
{
  recipient: ObjectId (Teacher),
  title: String,
  message: String,
  type: String (enum: ["enrollment", "course_update", "message", "announcement"]),
  relatedCourse: ObjectId,
  relatedStudent: ObjectId,
  isRead: Boolean,
  actionUrl: String,
  timestamps: true
}
```

### Email Notification

When a student enrolls, the teacher receives a formatted email containing:

- Student name
- Course title
- Enrollment date
- Link to view enrollment details
- Beautiful HTML template with branding

## Configuration

### Email Setup (Required)

1. **Install Gmail App Password** (if using Gmail):

   ```
   1. Go to https://myaccount.google.com/apppasswords
   2. Select "Mail" and "Windows Computer"
   3. Create App Password
   4. Copy the 16-character password
   ```

2. **Configure .env file**:

   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   EMAIL_FROM=noreply@learningplatform.com
   ```

3. **Alternative SMTP Services**:
   - Outlook: smtp-mail.outlook.com:587
   - SendGrid: smtp.sendgrid.net:587
   - Mailgun: smtp.mailgun.org:587

### Environment Variables

See `backend/.env.example` for complete list. Key variables:

```
EMAIL_HOST         - SMTP server address
EMAIL_PORT         - SMTP port (usually 587 for non-secure)
EMAIL_SECURE       - Use TLS (false for port 587)
EMAIL_USER         - Email account for sending
EMAIL_PASSWORD     - App password or account password
EMAIL_FROM         - Display name for "From" field
```

## API Endpoints

### Enroll in Course

```
POST /api/courses/:id/enroll
Headers: Authorization: Bearer <token>
Response: {
  message: "Successfully enrolled in course",
  course: { ... },
  notification: { ... }
}
```

### Get Notifications

```
GET /api/notifications
Headers: Authorization: Bearer <token>
Response: [ { id, title, message, type, createdAt, ... } ]
```

### Get Unread Count

```
GET /api/notifications/unread/count
Headers: Authorization: Bearer <token>
Response: { unreadCount: 5 }
```

### Mark as Read

```
PUT /api/notifications/:id/read
Headers: Authorization: Bearer <token>
Response: { message: "Notification marked as read", notification: { ... } }
```

### Delete Notification

```
DELETE /api/notifications/:id
Headers: Authorization: Bearer <token>
Response: { message: "Notification deleted" }
```

## User Flow

### Student Perspective

1. Student navigates to "All Courses" or "Recommended Courses"
2. Clicks "Explore Course" button on a course card
3. Lands on CourseDetail page with full course information
4. Clicks "Enroll Now" button
5. Button shows loading spinner ("Enrolling...")
6. Receives success toast notification: "Successfully enrolled in the course! 🎉"
7. Auto-redirects to courses page after 2 seconds
8. Button changes to "Enrolled" state (disabled)

### Teacher Perspective

1. Teacher sees bell icon in top navigation with red dot if new notifications
2. Clicks bell icon to open notification panel
3. Views all notifications with:
   - Student name
   - Course title
   - Enrollment timestamp
   - Visual indicator for unread notifications
4. Notifications refresh every 30 seconds automatically
5. Can mark notifications as read (via future enhancement)
6. Receives email notification immediately when student enrolls

## Future Enhancements

1. **Notification Preferences**
   - Allow teachers to enable/disable email notifications
   - Choose notification frequency (immediate, daily digest, weekly)

2. **Notification Actions**
   - Click notification to view student profile
   - Quick actions from notification (approve, reject)

3. **Real-time Notifications**
   - Implement WebSocket for instant notifications
   - Use Socket.io for real-time updates

4. **Notification Templates**
   - Allow teachers to customize email templates
   - Support multiple notification types

5. **Notification History**
   - Archive old notifications
   - Search and filter notifications
   - Bulk operations (mark all as read, delete)

## Testing

### Test Email Configuration

```javascript
// Add to backend/server.js to test email setup:
import { verifyEmailConfig } from "./services/emailService.js";
verifyEmailConfig();
```

### Manual Testing

1. Create a test course as a teacher
2. Log in as a student
3. Navigate to course detail
4. Click "Enroll Now"
5. Check teacher's email for notification
6. Check teacher's dashboard for in-app notification

## Troubleshooting

### Emails Not Sending

- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Verify email account has access to SMTP
- Check EMAIL_HOST and EMAIL_PORT are correct
- Look for errors in server console

### Notifications Not Appearing

- Ensure notifications route is registered in server.js
- Check browser console for API errors
- Verify user is authenticated (token in localStorage)

### Email Formatting Issues

- Check that htmlContent in emailService.js is valid HTML
- Test different email clients (Gmail, Outlook, etc.)
- Consider using email templating library like EJS

## Files Modified/Created

### New Files

- `backend/models/Notification.js` - Notification model
- `backend/services/emailService.js` - Email sending service
- `backend/routes/notificationRoutes.js` - Notification API routes
- `backend/.env.example` - Environment variable template

### Modified Files

- `backend/routes/courseRoutes.js` - Added enroll endpoint
- `backend/server.js` - Added notification routes and imports
- `backend/.env` - Added email configuration variables
- `client/src/pages/CourseDetail.jsx` - Enhanced enrollment UX
- `client/src/pages/Teacher/TeacherDashboard.jsx` - Added notification panel

### Dependencies Added

- `nodemailer` - Email sending library

## Summary

This implementation provides a complete enrollment notification system that:
✅ Notifies teachers instantly when students enroll
✅ Sends professional HTML emails
✅ Displays notifications in teacher dashboard
✅ Provides smooth UI feedback to students
✅ Is fully configurable via environment variables
✅ Includes proper error handling and validation
✅ Supports future enhancements and scaling
