# PhD Portal - Test User Credentials

## Overview
This document contains login credentials for all test users in the PhD Portal system.
These users were created with proper hierarchical relationships:
- 1 Admin (system-wide access)
- 1 Faculty Coordinator for Computer Engineering
- 3 Research Guides (each with 3-4 assigned students)
- 10 PhD Students

---

## 🔐 Login Credentials

### Admin Account
**Email:** `admin@phdportal.edu`
**Password:** `admin123`
**Roles:** Admin
**Access:** Full system access, manage all users and departments

---

### Faculty Coordinator
**Email:** `faculty.ce@phdportal.edu`
**Password:** `faculty123`
**Roles:** FacultyCoordinator
**Department:** Computer Engineering
**Access:** Manage students and guides in Computer Engineering department

---

### Research Guides

#### Guide 1 - Machine Learning Specialist
**Email:** `guide1.ce@phdportal.edu`
**Password:** `guide123`
**Specialization:** Machine Learning
**Assigned Students:**
- student1.ce@phdportal.edu (Aarav Singh)
- student2.ce@phdportal.edu (Vivaan Mehta)
- student3.ce@phdportal.edu (Aditya Reddy)
- student4.ce@phdportal.edu (Vihaan Gupta)

#### Guide 2 - Computer Networks Specialist
**Email:** `guide2.ce@phdportal.edu`
**Password:** `guide123`
**Specialization:** Computer Networks
**Assigned Students:**
- student5.ce@phdportal.edu (Arjun Iyer)
- student6.ce@phdportal.edu (Sai Nair)
- student7.ce@phdportal.edu (Arnav Desai)

#### Guide 3 - Data Science Specialist
**Email:** `guide3.ce@phdportal.edu`
**Password:** `guide123`
**Specialization:** Data Science
**Assigned Students:**
- student8.ce@phdportal.edu (Ayaan Joshi)
- student9.ce@phdportal.edu (Krishna Rao)
- student10.ce@phdportal.edu (Ishaan Pillai)

---

### Students

All students have the same password: `student123`

| Email | Name | Assigned Guide | Roll Number |
|-------|------|----------------|-------------|
| student1.ce@phdportal.edu | Aarav Singh | guide1.ce@phdportal.edu | PHD2024CE001 |
| student2.ce@phdportal.edu | Vivaan Mehta | guide1.ce@phdportal.edu | PHD2024CE002 |
| student3.ce@phdportal.edu | Aditya Reddy | guide1.ce@phdportal.edu | PHD2024CE003 |
| student4.ce@phdportal.edu | Vihaan Gupta | guide1.ce@phdportal.edu | PHD2024CE004 |
| student5.ce@phdportal.edu | Arjun Iyer | guide2.ce@phdportal.edu | PHD2024CE005 |
| student6.ce@phdportal.edu | Sai Nair | guide2.ce@phdportal.edu | PHD2024CE006 |
| student7.ce@phdportal.edu | Arnav Desai | guide2.ce@phdportal.edu | PHD2024CE007 |
| student8.ce@phdportal.edu | Ayaan Joshi | guide3.ce@phdportal.edu | PHD2024CE008 |
| student9.ce@phdportal.edu | Krishna Rao | guide3.ce@phdportal.edu | PHD2024CE009 |
| student10.ce@phdportal.edu | Ishaan Pillai | guide3.ce@phdportal.edu | PHD2024CE010 |

---

## 🏗️ System Architecture

### Hierarchy
```
Admin (admin@phdportal.edu)
  └── Faculty Coordinator (faculty.ce@phdportal.edu) - Computer Engineering
       ├── Guide 1 (guide1.ce@phdportal.edu) - Machine Learning
       │    ├── Student 1
       │    ├── Student 2
       │    ├── Student 3
       │    └── Student 4
       ├── Guide 2 (guide2.ce@phdportal.edu) - Computer Networks
       │    ├── Student 5
       │    ├── Student 6
       │    └── Student 7
       └── Guide 3 (guide3.ce@phdportal.edu) - Data Science
            ├── Student 8
            ├── Student 9
            └── Student 10
```

### Database Relationships
- **Admin** can view/manage all users across all departments
- **Faculty Coordinator** manages guides and students in their department (Computer Engineering)
- **Guides** can view and manage only their assigned students
- **Students** are assigned to specific guides via `programDetails.guideId`

---

## 🚀 How to Use

### 1. Login Process
1. Navigate to `http://localhost:5173`
2. Click on "SVV LOGIN" tab
3. Enter email and password from above
4. Click "LOGIN"

### 2. Testing Different Roles
- **Test Guide Dashboard:** Login as any guide to see their assigned students
- **Test Faculty Dashboard:** Login as faculty coordinator to see all guides and students in Computer Engineering
- **Test Admin Dashboard:** Login as admin to see system-wide statistics
- **Test Student Dashboard:** Login as any student to see their guide and assignments

### 3. Re-seed Database
If you need to reset the database with fresh test data:
```bash
cd Backend
node utility/seedUsers.js
```

---

## 📝 Notes

- All users have `registrationComplete: true` (no need to go through registration flow)
- All users are in the **Computer Engineering** department
- Student-Guide assignments are stored in `User.programDetails.guideId`
- Controllers use these relationships to filter and display relevant data
- Both Google OAuth and local authentication (email/password) are supported

---

## 🔧 Development

### Adding More Test Data
Edit `Backend/utility/seedUsers.js` to:
- Add more departments
- Create additional guides
- Add more students
- Modify relationships

### Resetting Password
To change a user's password, use MongoDB shell or Compass to update the user document. The password will be automatically hashed on save.

---

**Last Updated:** October 31, 2025
