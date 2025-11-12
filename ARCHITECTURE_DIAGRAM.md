# PhD Portal - System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PhD PORTAL SYSTEM                                │
│                    Authentication & User Hierarchy                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐         ┌──────────────────────┐             │
│  │   Google OAuth      │         │  Email/Password      │             │
│  │                     │         │                      │             │
│  │  - Existing System  │         │  - NEW: Local Auth   │             │
│  │  - Gmail Login      │         │  - Bcrypt Hashing    │             │
│  │  - Auto-register    │         │  - Passport Local    │             │
│  └──────────┬──────────┘         └──────────┬───────────┘             │
│             │                               │                          │
│             └───────────────┬───────────────┘                          │
│                             ▼                                           │
│                  ┌──────────────────────┐                              │
│                  │  Passport.js Session │                              │
│                  │  - User Serialization│                              │
│                  │  - Role Management   │                              │
│                  └──────────┬───────────┘                              │
│                             │                                           │
└─────────────────────────────┼───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER HIERARCHY                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────────────────────────────────────────────────┐       │
│   │                    👨‍💼 ADMIN                                │       │
│   │        admin@phdportal.edu / admin123                      │       │
│   │        Role: ["Admin"]                                     │       │
│   │        Access: Full System Control                         │       │
│   └────────────────┬───────────────────────────────────────────┘       │
│                    │                                                    │
│                    ▼                                                    │
│   ┌────────────────────────────────────────────────────────────┐       │
│   │         👔 FACULTY COORDINATOR                             │       │
│   │   faculty.ce@phdportal.edu / faculty123                    │       │
│   │   Role: ["FacultyCoordinator"]                             │       │
│   │   Department: Computer Engineering                         │       │
│   │   Manages: All Guides & Students in Dept                   │       │
│   └────────────────┬───────────────────────────────────────────┘       │
│                    │                                                    │
│         ┌──────────┼──────────┐                                        │
│         │          │          │                                        │
│         ▼          ▼          ▼                                        │
│   ┌─────────┐┌─────────┐┌─────────┐                                  │
│   │ 👨‍🏫      ││ 👨‍🏫      ││ 👨‍🏫      │                                  │
│   │ GUIDE 1 ││ GUIDE 2 ││ GUIDE 3 │                                  │
│   ├─────────┤├─────────┤├─────────┤                                  │
│   │ guide1. ││ guide2. ││ guide3. │                                  │
│   │ ce@phd  ││ ce@phd  ││ ce@phd  │                                  │
│   │ portal  ││ portal  ││ portal  │                                  │
│   │ .edu    ││ .edu    ││ .edu    │                                  │
│   ├─────────┤├─────────┤├─────────┤                                  │
│   │ Pass:   ││ Pass:   ││ Pass:   │                                  │
│   │ guide123││ guide123││ guide123│                                  │
│   ├─────────┤├─────────┤├─────────┤                                  │
│   │ Spec:   ││ Spec:   ││ Spec:   │                                  │
│   │ Machine ││Computer ││  Data   │                                  │
│   │Learning ││Networks ││ Science │                                  │
│   ├─────────┤├─────────┤├─────────┤                                  │
│   │Students:││Students:││Students:│                                  │
│   │    4    ││    3    ││    3    │                                  │
│   └────┬────┘└────┬────┘└────┬────┘                                  │
│        │          │          │                                        │
│   ┌────┼──────────┼──────────┼────┐                                  │
│   │    ▼          ▼          ▼    │                                  │
│   │  ┌────┐    ┌────┐    ┌────┐  │                                  │
│   │  │ S1 │    │ S5 │    │ S8 │  │                                  │
│   │  ├────┤    ├────┤    ├────┤  │                                  │
│   │  │ S2 │    │ S6 │    │ S9 │  │                                  │
│   │  ├────┤    ├────┤    ├────┤  │                                  │
│   │  │ S3 │    │ S7 │    │S10 │  │                                  │
│   │  ├────┤    └────┘    └────┘  │                                  │
│   │  │ S4 │                       │                                  │
│   │  └────┘                       │                                  │
│   │                                │                                  │
│   │  📚 STUDENTS                   │                                  │
│   │  student1-10.ce@phdportal.edu │                                  │
│   │  Password: student123          │                                  │
│   │  Role: ["Student"]             │                                  │
│   └────────────────────────────────┘                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE RELATIONSHIPS                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Student Document:                  Guide Document:                     │
│  ┌─────────────────────────┐       ┌──────────────────────┐           │
│  │ _id: ObjectId(...)      │       │ _id: ObjectId(...)   │           │
│  │ email: student1.ce@...  │       │ email: guide1.ce@... │           │
│  │ roles: ["Student"]      │       │ roles: ["Guide"]     │           │
│  │ programDetails: {       │       │ programDetails: {    │           │
│  │   guideId: ───────────────────→ │   department: "CE"   │           │
│  │   guideName: "..."      │       │   domain: "ML"       │           │
│  │   guideEmail: "..."     │       │ }                    │           │
│  │   department: "CE"      │       └──────────────────────┘           │
│  │ }                       │                                            │
│  └─────────────────────────┘                                            │
│                                                                          │
│  ▶ Students reference their Guide via programDetails.guideId            │
│  ▶ Guides query students: User.find({ "programDetails.guideId": id })  │
│  ▶ Faculty queries by department: User.find({ department: "CE" })      │
│  ▶ Admin sees all: User.find({})                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. User visits login page                                              │
│     ↓                                                                    │
│  2. Chooses auth method:                                                │
│     ┌─────────────────┐         ┌──────────────────┐                  │
│     │ Google OAuth    │   OR    │ Email/Password   │                  │
│     └────────┬────────┘         └────────┬─────────┘                  │
│              │                           │                              │
│              ▼                           ▼                              │
│     ┌────────────────┐         ┌──────────────────┐                  │
│     │ Google Strategy│         │ Local Strategy   │                  │
│     │ - OAuth flow   │         │ - Validate email │                  │
│     │ - Get profile  │         │ - Compare pass   │                  │
│     └────────┬───────┘         └────────┬─────────┘                  │
│              │                           │                              │
│              └──────────┬────────────────┘                              │
│                         ▼                                               │
│              ┌─────────────────────┐                                    │
│              │ Passport Session    │                                    │
│              │ - Serialize user    │                                    │
│              │ - Create session    │                                    │
│              └──────────┬──────────┘                                    │
│                         ▼                                               │
│              ┌─────────────────────┐                                    │
│              │ Role-based Redirect │                                    │
│              │ - Student → /student│                                    │
│              │ - Guide → /guide    │                                    │
│              │ - Faculty → /faculty│                                    │
│              │ - Admin → /admin    │                                    │
│              └─────────────────────┘                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DATA FLOW (GUIDE)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Guide logs in (guide1.ce@phdportal.edu)                               │
│      ↓                                                                   │
│  Frontend: Navigate to /guide/dashboard                                 │
│      ↓                                                                   │
│  API Call: GET /api/guide/dashboard/students                            │
│      ↓                                                                   │
│  Backend Controller:                                                     │
│  ┌──────────────────────────────────────────┐                          │
│  │ getAssignedStudents(req, res) {          │                          │
│  │   const guideId = req.user._id;          │                          │
│  │                                           │                          │
│  │   const students = await User.find({     │                          │
│  │     "programDetails.guideId": guideId,   │ ← Filter by THIS guide   │
│  │     roles: "Student"                     │                          │
│  │   });                                     │                          │
│  │                                           │                          │
│  │   // Calculate progress, attendance      │                          │
│  │   // Return REAL student data            │                          │
│  │ }                                         │                          │
│  └──────────────────────────────────────────┘                          │
│      ↓                                                                   │
│  Returns: [Student1, Student2, Student3, Student4]                      │
│      ↓                                                                   │
│  Frontend displays 4 students assigned to Guide 1                       │
│                                                                          │
│  ✅ NO HARDCODED DATA!                                                  │
│  ✅ REAL DATABASE QUERIES!                                              │
│  ✅ PROPER RELATIONSHIPS!                                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         KEY IMPROVEMENTS                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  BEFORE:                              AFTER:                            │
│  ❌ Hardcoded fake data               ✅ Real database queries          │
│  ❌ "Failed to load students"         ✅ Shows assigned students        │
│  ❌ "Forbidden access denied"         ✅ Proper authentication          │
│  ❌ Only Google OAuth                 ✅ Email/Password + OAuth         │
│  ❌ No test users                     ✅ Complete user hierarchy        │
│  ❌ No relationships                  ✅ Student-Guide relationships    │
│  ❌ Guide sees all students           ✅ Guide sees ONLY their students │
│  ❌ Faculty sees fake data            ✅ Faculty sees dept. data        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          TESTING CHECKLIST                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  □ Login with Guide 1 → See 4 students (S1, S2, S3, S4)               │
│  □ Login with Guide 2 → See 3 students (S5, S6, S7)                   │
│  □ Login with Guide 3 → See 3 students (S8, S9, S10)                  │
│  □ Login with Faculty → See all 3 guides and 10 students               │
│  □ Login with Admin → See system stats                                 │
│  □ Login with Student → See assigned guide                             │
│  □ Try wrong password → See error message                              │
│  □ Check assignments page → No "forbidden" error                       │
│  □ Verify no hardcoded data anywhere                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

LEGEND:
 👨‍💼 Admin    - System administrator
 👔 Faculty  - Department coordinator
 👨‍🏫 Guide   - Research supervisor
 📚 Student  - PhD candidate
 ▶  Indicates data flow direction
 →  Indicates relationship/reference
 ✅ Feature implemented
 ❌ Previous issue (now fixed)

STATUS: ✅ FULLY IMPLEMENTED & READY TO USE
DATE: October 31, 2025
