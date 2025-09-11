# Guide Assignment API Documentation

This document describes the API endpoints for managing guide-student assignments in the PhD Portal.

## Base URL
All endpoints are prefixed with `/guide-assignment`

## Authentication
All endpoints require authentication. Include session cookies in requests.

## Endpoints

### Admin-Only Endpoints

#### 1. Assign Guide to Student
**POST** `/guide-assignment/assign`

Assigns a guide to a student using their MongoDB ObjectIds.

**Request Body:**
```json
{
  "studentId": "64a7b8c9d12345678901234a",
  "guideId": "64a7b8c9d12345678901234b"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guide assigned successfully",
  "assignment": {
    "studentId": "64a7b8c9d12345678901234a",
    "guideId": "64a7b8c9d12345678901234b",
    "guideName": "Dr. John Smith",
    "guideEmail": "john.smith@example.com",
    "assignmentDate": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Unassign Guide from Student
**DELETE** `/guide-assignment/unassign/:studentId`

Removes the guide assignment from a student.

**Response:**
```json
{
  "success": true,
  "message": "Guide unassigned successfully",
  "studentId": "64a7b8c9d12345678901234a"
}
```

#### 3. Change Guide for Student
**PUT** `/guide-assignment/change/:studentId`

Changes the assigned guide for a student.

**Request Body:**
```json
{
  "newGuideId": "64a7b8c9d12345678901234c"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guide changed successfully",
  "assignment": {
    "studentId": "64a7b8c9d12345678901234a",
    "guideId": "64a7b8c9d12345678901234c",
    "guideName": "Dr. Jane Doe",
    "guideEmail": "jane.doe@example.com",
    "assignmentDate": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 4. Get All Students with Guide Status
**GET** `/guide-assignment/students`

Returns paginated list of all students with their guide assignment status.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "_id": "64a7b8c9d12345678901234a",
      "email": "student@example.com",
      "name": "Alice Johnson",
      "rollNumber": "PHD2024001",
      "department": "Computer Science",
      "guide": {
        "_id": "64a7b8c9d12345678901234b",
        "email": "guide@example.com",
        "name": "Dr. John Smith"
      },
      "guideAssignmentStatus": "Assigned",
      "guideAssignmentDate": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3,
    "limit": 10
  }
}
```

#### 5. Get Assignment Statistics
**GET** `/guide-assignment/stats`

Returns statistics about guide assignments.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalStudents": 50,
    "assignedStudents": 35,
    "unassignedStudents": 15,
    "totalGuides": 10,
    "assignmentPercentage": "70.00",
    "guideWorkload": [
      {
        "guideId": "64a7b8c9d12345678901234b",
        "guideName": "Dr. John Smith",
        "guideEmail": "john.smith@example.com",
        "studentCount": 8
      }
    ]
  }
}
```

### Admin and Guide Accessible Endpoints

#### 6. Get All Guides
**GET** `/guide-assignment/guides`

Returns list of all users with Guide role.

**Response:**
```json
{
  "success": true,
  "guides": [
    {
      "_id": "64a7b8c9d12345678901234b",
      "email": "guide@example.com",
      "personalDetails": {
        "firstName": "John",
        "lastName": "Smith"
      },
      "roles": ["Guide"],
      "createdAt": "2023-12-01T00:00:00.000Z"
    }
  ],
  "count": 10
}
```

#### 7. Get Students for Specific Guide
**GET** `/guide-assignment/guide/:guideId/students`

Returns all students assigned to a specific guide.

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "_id": "64a7b8c9d12345678901234a",
      "email": "student@example.com",
      "personalDetails": {
        "firstName": "Alice",
        "lastName": "Johnson"
      },
      "programDetails": {
        "rollNumber": "PHD2024001",
        "department": "Computer Science",
        "guideAssignmentDate": "2024-01-15T10:30:00.000Z"
      }
    }
  ],
  "count": 5
}
```

#### 8. Get Guide for Specific Student
**GET** `/guide-assignment/student/:studentId/guide`

Returns guide details for a specific student.

**Response:**
```json
{
  "success": true,
  "guide": {
    "_id": "64a7b8c9d12345678901234b",
    "email": "guide@example.com",
    "personalDetails": {
      "firstName": "John",
      "lastName": "Smith"
    }
  },
  "assignmentStatus": "Assigned",
  "assignmentDate": "2024-01-15T10:30:00.000Z"
}
```

### Role-Specific Endpoints

#### 9. Get My Students (Guide Only)
**GET** `/guide-assignment/my-students`

Returns students assigned to the current logged-in guide.

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "_id": "64a7b8c9d12345678901234a",
      "email": "student@example.com",
      "name": "Alice Johnson",
      "rollNumber": "PHD2024001",
      "department": "Computer Science",
      "enrollmentYear": "2024",
      "semester": "1",
      "domain": "Machine Learning",
      "topic": "Deep Learning Applications",
      "guideAssignmentDate": "2024-01-15T10:30:00.000Z",
      "status": "Active"
    }
  ],
  "count": 5
}
```

#### 10. Get My Guide (Student Only)
**GET** `/guide-assignment/my-guide`

Returns guide details for the current logged-in student.

**Response:**
```json
{
  "success": true,
  "guide": {
    "_id": "64a7b8c9d12345678901234b",
    "email": "guide@example.com",
    "personalDetails": {
      "firstName": "John",
      "lastName": "Smith"
    }
  },
  "assignmentStatus": "Assigned",
  "assignmentDate": "2024-01-15T10:30:00.000Z"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

## Common HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request data or validation error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Guide Assignment Status Values

- `"Unassigned"` - Student has no guide assigned
- `"Pending"` - Guide assignment is in progress
- `"Assigned"` - Student has been assigned a guide
- `"Changed"` - Student's guide has been changed from a previous assignment

## Schema Updates

### User Schema - Program Details Section

The `programDetails` section now includes:

```javascript
{
  // ... other fields
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: async function(value) {
        if (!value) return true;
        const User = mongoose.model("User");
        const guide = await User.findById(value);
        return guide && guide.roles && guide.roles.includes("Guide");
      },
      message: "Referenced user must exist and have Guide role"
    }
  },
  guideName: { type: String }, // Legacy field
  guideEmail: { type: String }, // Legacy field
  guideAssignmentStatus: {
    type: String,
    enum: ["Pending", "Assigned", "Changed", "Unassigned"],
    default: "Unassigned"
  },
  guideAssignmentDate: { type: Date }
}
```

## Migration Scripts

Two migration scripts are available:

1. `migrateRolesToArray.js` - Converts single role to roles array
2. `migrateGuideAssignments.js` - Links existing guide assignments to ObjectIds

Run manually with:
```bash
node runMigration.js
```

Or they run automatically when the server starts.