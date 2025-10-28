# Guide Dashboard Backend Integration

This document details the complete backend implementation for the Guide Dashboard and related features.

## New Backend Components

### 1. Controller: `GuideDashboardController.js`

Located at: `Backend/Controller/GuideDashboardController.js`

**Endpoints Implemented:**

#### `getAssignedStudents()`
- **Purpose**: Fetches all students assigned to a guide with progress and attendance metrics
- **Returns**: Array of students with calculated progress based on assignment submissions and attendance based on schedule events
- **Features**:
  - Calculates progress percentage based on assignment submissions
  - Calculates attendance percentage from schedule events
  - Returns formatted student data with batch, enrollment year, department

#### `getGuideAssignments()`
- **Purpose**: Fetches all assignments created by the guide with submission statistics
- **Returns**: Array of assignments with submission counts and deadlines
- **Features**:
  - Automatically determines locked/unlocked status based on deadline
  - Counts submissions per assignment
  - Formats dates for display

#### `getGuideSchedule()`
- **Purpose**: Fetches schedule events for a specific week
- **Parameters**: `weekStart` (optional) - ISO date string for week start
- **Returns**: Events organized by date with proper categorization
- **Features**:
  - Fetches events where guide is organizer or attendee
  - Automatically categorizes events (test, deadline, check, other)
  - Filters out cancelled events
  - Returns events in calendar format

#### `getDashboardSummary()`
- **Purpose**: Provides quick statistics for the dashboard
- **Returns**: Summary object with counts
- **Includes**:
  - Student count
  - Assignment count
  - Upcoming events count
  - Pending submissions count

#### `getGuideProfile()`
- **Purpose**: Fetches guide's profile information
- **Returns**: Guide profile with name, email, department, roles

#### `getStudentProfile()`
- **Purpose**: Fetches detailed profile of a specific student
- **Parameters**: `studentId` in URL params
- **Returns**: Complete student profile with assignments, progress, and attendance
- **Features**:
  - Verifies student is assigned to the requesting guide
  - Includes all assignment details with submission status
  - Calculates progress and attendance metrics
  - Returns comprehensive student information

### 2. Routes: `guideDashboard.js`

Located at: `Backend/routes/guideDashboard.js`

**Protected Routes** (All require authentication and Guide role):

```
GET /guide/dashboard/students           - Get assigned students
GET /guide/dashboard/assignments        - Get guide's assignments
GET /guide/dashboard/schedule           - Get schedule events (with optional weekStart query param)
GET /guide/dashboard/summary            - Get dashboard summary statistics
GET /guide/dashboard/profile            - Get guide profile
GET /guide/dashboard/students/:studentId - Get detailed student profile
```

### 3. Frontend Service: `guideDashboardService.js`

Located at: `PhD_Portal/src/services/guideDashboardService.js`

**Service Methods:**
- `getAssignedStudents()` - Fetch assigned students
- `getGuideAssignments()` - Fetch assignments
- `getGuideSchedule(weekStart)` - Fetch schedule events
- `getDashboardSummary()` - Fetch summary statistics
- `getGuideProfile()` - Fetch guide profile
- `getStudentProfile(studentId)` - Fetch student profile

## Updated Frontend Components

### 1. `GuideDashboard.jsx`
- **Changes**: Now fetches real data from backend
- **Features**:
  - Loading states with skeleton screens
  - Error handling with retry functionality
  - Real-time data from backend
  - Dynamic profile name display

### 2. `GuideSchedule.jsx`
- **Changes**: Integrated with backend schedule API
- **Features**:
  - Fetches real schedule events from backend
  - Week navigation with automatic data refresh
  - Event categorization and color coding
  - Loading states

### 3. `GuideStudentList.jsx`
- **Changes**: Component receives real student data
- **Features**:
  - Custom scrollbar styling
  - Progress bars with real data
  - Attendance badges with color coding
  - Scrollable content when list is long

### 4. `GuideAssignments.jsx`
- **Changes**: Displays real assignments with submission tracking
- **Features**:
  - Locked/unlocked status based on deadlines
  - Submission progress bars
  - Scrollable content for many assignments
  - Real submission counts

### 5. `StudentList.jsx`
- **Changes**: Fetches real student data with loading states
- **Features**:
  - Loading skeletons
  - Error handling
  - Empty state when no students
  - Announcement feature placeholder

### 6. `StudentProfilePage.jsx`
- **Changes**: Complete rewrite to use backend data
- **Features**:
  - Fetches detailed student profile
  - Displays all student information
  - Shows assignment submission status
  - Displays attendance metrics
  - Loading and error states

## Database Models Used

### User Model
- Fields used: `personalDetails`, `programDetails`, `email`, `roles`, `programDetails.guideId`
- Purpose: Store user information and guide-student relationships

### Assignment Model
- Fields used: `title`, `description`, `deadline`, `attachments`, `createdBy`
- Purpose: Store assignment information

### Submission Model
- Fields used: `assignment`, `student`, `status`, `grade`, `submittedAt`
- Purpose: Track assignment submissions

### Schedule Model
- Fields used: `title`, `description`, `date`, `startTime`, `endTime`, `organizer`, `attendees`, `type`, `status`
- Purpose: Store and track schedule events

## Key Features Implemented

### Progress Calculation
- Based on assignment submission ratio
- Automatically updates as students submit work
- Displayed as percentage

### Attendance Tracking
- Based on schedule event attendance
- Tracks Present/Absent status
- Calculates attendance percentage

### Assignment Status
- Automatically locks assignments past deadline
- Tracks submission counts in real-time
- Shows submission progress

### Schedule Management
- Week-by-week navigation
- Event categorization (test, deadline, check, other)
- Color-coded event types
- Today's date highlighting

### Security
- All routes protected with authentication
- Role-based access control (Guide role required)
- Student data only accessible to assigned guide

## API Response Formats

### Students Response
```json
{
  "students": [
    {
      "id": "userId",
      "name": "Full Name",
      "email": "email@example.com",
      "batch": "Batch-B3",
      "enrollmentYear": "2023",
      "department": "Computer Science",
      "progress": 80,
      "attendance": 90,
      "registrationComplete": true
    }
  ],
  "count": 10
}
```

### Assignments Response
```json
{
  "assignments": [
    {
      "id": "assignmentId",
      "title": "Assignment 1",
      "description": "Description",
      "uploadedDate": "01/15/2025, 02:36pm",
      "deadline": "01/20/2025, 11:59pm",
      "status": "unlocked",
      "submissions": 6,
      "totalStudents": 10,
      "attachments": []
    }
  ],
  "count": 3
}
```

### Schedule Response
```json
{
  "events": {
    "2025-10-20": [
      {
        "id": "eventId",
        "title": "Check progress of students",
        "type": "check",
        "description": "...",
        "startTime": "10:00",
        "endTime": "11:00",
        "location": "Room 101",
        "status": "Scheduled"
      }
    ]
  },
  "weekStart": "2025-10-19",
  "weekEnd": "2025-10-25"
}
```

### Student Profile Response
```json
{
  "student": {
    "id": "studentId",
    "name": "Full Name",
    "email": "email@example.com",
    "enrollmentId": "EID123",
    "phone": "1234567890",
    "department": "Computer Science",
    "domain": "AI/ML",
    "topic": "Deep Learning",
    "researchStatus": "Ongoing",
    "researchDescription": "...",
    "assignments": [
      {
        "id": "assignmentId",
        "title": "Assignment 1",
        "status": "submitted",
        "deadline": "01/20/2025",
        "submittedAt": "01/19/2025",
        "grade": 85
      }
    ],
    "progress": 80,
    "attendance": {
      "total": 20,
      "attended": 18,
      "percentage": 90
    }
  }
}
```

## Testing Recommendations

1. **Test with no students assigned**: Verify empty state displays correctly
2. **Test with multiple students**: Check scrolling and performance
3. **Test assignment deadlines**: Verify locked/unlocked status changes
4. **Test week navigation**: Ensure schedule updates correctly
5. **Test student profile**: Verify all data displays correctly
6. **Test progress calculations**: Create assignments and submissions to verify accuracy
7. **Test attendance tracking**: Create schedule events and mark attendance

## Future Enhancements

- Real-time notifications for new submissions
- Announcement posting functionality
- Assignment grading interface
- Schedule event creation from dashboard
- Student performance analytics
- Export student data functionality
- Batch operations on students
- Assignment templates
- Calendar integration (Google Calendar, Outlook)
- Email notifications for deadlines

## Migration Notes

No database migrations are required as we're using existing models. However, ensure:
1. All users have proper roles assigned
2. Guide-student relationships are established via `programDetails.guideId`
3. Schedule events include guide in organizer or attendees
4. Assignments have proper `createdBy` reference

## Performance Considerations

- Student list and assignment lists are paginated on frontend with custom scrollbars
- Schedule queries are limited to one week at a time
- Progress calculations are done on-demand
- Consider adding caching for frequently accessed data
- Index on `programDetails.guideId` recommended for faster student queries

## Error Handling

All endpoints include:
- Try-catch blocks
- Proper error messages
- HTTP status codes (200, 404, 500)
- Console logging for debugging
- Frontend error states with retry functionality
