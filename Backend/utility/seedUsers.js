const mongoose = require("mongoose");
const User = require("../Model/User");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Seed users with relationships
const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users (optional - comment out if you want to keep existing users)
    console.log("⚠️  Clearing existing users...");
    await User.deleteMany({});

    console.log("📝 Creating users...");

    // 1. Create Admin
    const admin = await User.create({
      email: "admin@phdportal.edu",
      password: "admin123",
      authMethod: "local",
      roles: ["Admin"],
      registrationComplete: true,
      personalDetails: {
        firstName: "System",
        lastName: "Administrator",
        title: "Dr.",
        gender: "Male",
        contacts: {
          mobile: "9876543210",
          primaryEmail: "admin@phdportal.edu",
        },
      },
    });
    console.log("✅ Admin created:", admin.email);

    // 2. Create Faculty Coordinator for Computer Engineering
    const facultyCoordinator = await User.create({
      email: "faculty.ce@phdportal.edu",
      password: "faculty123",
      authMethod: "local",
      roles: ["FacultyCoordinator"],
      registrationComplete: true,
      personalDetails: {
        firstName: "Rajesh",
        lastName: "Kumar",
        title: "Prof.",
        gender: "Male",
        contacts: {
          mobile: "9876543211",
          primaryEmail: "faculty.ce@phdportal.edu",
        },
      },
      programDetails: {
        department: "Computer Engineering",
        institute: "Institute of Technology",
        designation: "Professor & Head",
      },
    });
    console.log("✅ Faculty Coordinator created:", facultyCoordinator.email);

    // 3. Create Guides for Computer Engineering Department
    const guides = [];
    const guideData = [
      {
        email: "guide1.ce@phdportal.edu",
        firstName: "Priya",
        lastName: "Sharma",
        specialization: "Machine Learning",
      },
      {
        email: "guide2.ce@phdportal.edu",
        firstName: "Amit",
        lastName: "Patel",
        specialization: "Computer Networks",
      },
      {
        email: "guide3.ce@phdportal.edu",
        firstName: "Sneha",
        lastName: "Verma",
        specialization: "Data Science",
      },
    ];

    for (const guideInfo of guideData) {
      const guide = await User.create({
        email: guideInfo.email,
        password: "guide123",
        authMethod: "local",
        roles: ["Guide"],
        registrationComplete: true,
        personalDetails: {
          firstName: guideInfo.firstName,
          lastName: guideInfo.lastName,
          title: "Dr.",
          gender: Math.random() > 0.5 ? "Male" : "Female",
          contacts: {
            mobile: `98765432${10 + guides.length}`,
            primaryEmail: guideInfo.email,
          },
        },
        programDetails: {
          department: "Computer Engineering",
          institute: "Institute of Technology",
          designation: "Assistant Professor",
          domain: guideInfo.specialization,
        },
      });
      guides.push(guide);
      console.log(`✅ Guide created: ${guide.email} (${guideInfo.specialization})`);
    }

    // 4. Create Students and assign to guides
    const students = [];
    const studentNames = [
      { firstName: "Aarav", lastName: "Singh" },
      { firstName: "Vivaan", lastName: "Mehta" },
      { firstName: "Aditya", lastName: "Reddy" },
      { firstName: "Vihaan", lastName: "Gupta" },
      { firstName: "Arjun", lastName: "Iyer" },
      { firstName: "Sai", lastName: "Nair" },
      { firstName: "Arnav", lastName: "Desai" },
      { firstName: "Ayaan", lastName: "Joshi" },
      { firstName: "Krishna", lastName: "Rao" },
      { firstName: "Ishaan", lastName: "Pillai" },
    ];

    for (let i = 0; i < studentNames.length; i++) {
      const studentInfo = studentNames[i];
      // Distribute students among guides (3-4 students per guide)
      const assignedGuide = guides[Math.floor(i / 3.3)];

      const student = await User.create({
        email: `student${i + 1}.ce@phdportal.edu`,
        password: "student123",
        authMethod: "local",
        roles: ["Student"],
        registrationComplete: true,
        personalDetails: {
          firstName: studentInfo.firstName,
          lastName: studentInfo.lastName,
          title: "Mr.",
          gender: Math.random() > 0.5 ? "Male" : "Female",
          contacts: {
            mobile: `98765432${20 + i}`,
            primaryEmail: `student${i + 1}.ce@phdportal.edu`,
          },
        },
        programDetails: {
          rollNumber: `PHD2024CE00${i + 1}`,
          department: "Computer Engineering",
          institute: "Institute of Technology",
          enrollmentYear: "2024",
          semester: "1",
          guideId: assignedGuide._id,
          guideName: `${assignedGuide.personalDetails.firstName} ${assignedGuide.personalDetails.lastName}`,
          guideEmail: assignedGuide.email,
          guideAssignmentStatus: "Assigned",
          guideAssignmentDate: new Date(),
          status: "Active",
          topic: `Research Topic ${i + 1}`,
          domain: assignedGuide.programDetails.domain,
        },
      });
      students.push(student);
      console.log(
        `✅ Student created: ${student.email} → Assigned to ${assignedGuide.email}`
      );
    }

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   • Admin: 1`);
    console.log(`   • Faculty Coordinators: 1`);
    console.log(`   • Guides: ${guides.length}`);
    console.log(`   • Students: ${students.length}`);
    console.log("\n🔑 Login Credentials:");
    console.log("\n   Admin:");
    console.log(`      Email: admin@phdportal.edu`);
    console.log(`      Password: admin123`);
    console.log("\n   Faculty Coordinator:");
    console.log(`      Email: faculty.ce@phdportal.edu`);
    console.log(`      Password: faculty123`);
    console.log("\n   Guides:");
    console.log(`      Email: guide1.ce@phdportal.edu, guide2.ce@phdportal.edu, guide3.ce@phdportal.edu`);
    console.log(`      Password: guide123`);
    console.log("\n   Students:");
    console.log(`      Email: student1.ce@phdportal.edu to student10.ce@phdportal.edu`);
    console.log(`      Password: student123`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

// Run seed
seedUsers();
