const mongoose = require("mongoose");
const User = require("../Model/User");
const Assignment = require("../Model/Assignment");
require("dotenv").config();

/**
 * Test script to verify assignment functionality and schema fields
 */

const testAssignments = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PhDPortal";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Test 1: Check if students with guides exist
    console.log("\n📋 Test 1: Checking students with guide assignments...");

    const studentsWithGuides = await User.find({
      roles: "Student",
      "programDetails.guideId": { $exists: true, $ne: null }
    }).populate("programDetails.guideId", "personalDetails email roles");

    console.log(`Found ${studentsWithGuides.length} students with assigned guides`);

    if (studentsWithGuides.length > 0) {
      const student = studentsWithGuides[0];
      console.log("Sample student with guide:");
      console.log({
        studentEmail: student.email,
        studentName: `${student.personalDetails?.firstName || ""} ${student.personalDetails?.lastName || ""}`.trim(),
        guideId: student.programDetails.guideId._id,
        guideName: `${student.programDetails.guideId.personalDetails?.firstName || ""} ${student.programDetails.guideId.personalDetails?.lastName || ""}`.trim(),
        guideEmail: student.programDetails.guideId.email,
        guideRoles: student.programDetails.guideId.roles
      });
    }

    // Test 2: Check guides
    console.log("\n👨‍🏫 Test 2: Checking guides...");

    const guides = await User.find({ roles: "Guide" }).select("email personalDetails roles");
    console.log(`Found ${guides.length} guides`);

    if (guides.length > 0) {
      console.log("Sample guide:");
      const guide = guides[0];
      console.log({
        guideEmail: guide.email,
        guideName: `${guide.personalDetails?.firstName || ""} ${guide.personalDetails?.lastName || ""}`.trim(),
        roles: guide.roles
      });
    }

    // Test 3: Check assignments
    console.log("\n📚 Test 3: Checking assignments...");

    const assignments = await Assignment.find({}).populate("createdBy", "personalDetails email").limit(5);
    console.log(`Found ${assignments.length} assignments`);

    if (assignments.length > 0) {
      console.log("Sample assignment:");
      const assignment = assignments[0];
      console.log({
        title: assignment.title,
        createdBy: assignment.createdBy ? {
          email: assignment.createdBy.email,
          name: `${assignment.createdBy.personalDetails?.firstName || ""} ${assignment.createdBy.personalDetails?.lastName || ""}`.trim()
        } : "Not populated",
        createdAt: assignment.createdAt
      });
    }

    // Test 4: Test the specific query that's failing
    console.log("\n🔍 Test 4: Testing assignment queries...");

    if (guides.length > 0) {
      const testGuideId = guides[0]._id;

      // Test the query from getAllAssignmentsByTheGuide
      try {
        const studentsForGuide = await User.find({
          roles: "Student",
          "programDetails.guideId": testGuideId,
        }).populate("programDetails.guideId", "personalDetails email");

        console.log(`✅ Successfully found ${studentsForGuide.length} students for guide ${testGuideId}`);

        if (studentsForGuide.length > 0) {
          const student = studentsForGuide[0];
          console.log("Student with populated guide:");
          console.log({
            studentEmail: student.email,
            hasGuideId: !!student.programDetails?.guideId,
            guidePopulated: !!student.programDetails?.guideId?.email
          });
        }

      } catch (error) {
        console.error("❌ Error in assignment query:", error.message);
      }

      // Test assignments by this guide
      try {
        const assignmentsByGuide = await Assignment.find({
          createdBy: testGuideId,
        }).populate("createdBy", "personalDetails email");

        console.log(`✅ Successfully found ${assignmentsByGuide.length} assignments created by guide ${testGuideId}`);

      } catch (error) {
        console.error("❌ Error in assignments by guide query:", error.message);
      }
    }

    // Test 5: Schema validation
    console.log("\n🔧 Test 5: Schema validation...");

    const userSchema = User.schema;
    const programDetailsPath = userSchema.paths['programDetails'];

    if (programDetailsPath) {
      const guideIdPath = programDetailsPath.schema.paths['guideId'];
      if (guideIdPath) {
        console.log("✅ programDetails.guideId exists in schema");
        console.log("Field type:", guideIdPath.instance);
        console.log("Is ObjectId:", guideIdPath.instance === 'ObjectID');
        console.log("Ref:", guideIdPath.options.ref);
      } else {
        console.log("❌ programDetails.guideId not found in schema");
      }
    }

    // Test 6: Check for old field references
    console.log("\n🗂️ Test 6: Checking for old field references...");

    const usersWithOldGuideField = await User.find({
      "programDetails.guide": { $exists: true }
    }).limit(5);

    if (usersWithOldGuideField.length > 0) {
      console.log(`⚠️ Found ${usersWithOldGuideField.length} users with old 'programDetails.guide' field`);
      console.log("These need to be migrated to 'programDetails.guideId'");
    } else {
      console.log("✅ No users with old 'programDetails.guide' field found");
    }

    console.log("\n🎉 Assignment test completed!");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run the test
testAssignments();
