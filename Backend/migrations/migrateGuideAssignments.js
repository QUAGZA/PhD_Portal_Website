const mongoose = require("mongoose");
require("dotenv").config();

const migrateGuideAssignments = async () => {
  try {
    console.log("Starting guide assignment migration...");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Find all students who have guide information but no guideId
    const studentsWithGuideInfo = await usersCollection
      .find({
        roles: "Student",
        $or: [
          { "programDetails.guideName": { $exists: true, $ne: "" } },
          { "programDetails.guideEmail": { $exists: true, $ne: "" } }
        ],
        "programDetails.guideId": { $exists: false }
      })
      .toArray();

    console.log(
      `Found ${studentsWithGuideInfo.length} students with guide information but no guideId`,
    );

    if (studentsWithGuideInfo.length === 0) {
      console.log("No students need guide assignment migration");
      return;
    }

    let updatedCount = 0;
    let notFoundCount = 0;

    // Process each student
    for (const student of studentsWithGuideInfo) {
      const guideEmail = student.programDetails?.guideEmail;
      const guideName = student.programDetails?.guideName;

      if (!guideEmail && !guideName) {
        continue;
      }

      let guide = null;

      // Try to find guide by email first
      if (guideEmail) {
        guide = await usersCollection.findOne({
          email: guideEmail,
          roles: "Guide"
        });
      }

      // If not found by email, try to find by name
      if (!guide && guideName) {
        const nameWords = guideName.trim().split(/\s+/);
        if (nameWords.length >= 2) {
          const firstName = nameWords[0];
          const lastName = nameWords[nameWords.length - 1];

          guide = await usersCollection.findOne({
            roles: "Guide",
            $and: [
              { "personalDetails.firstName": { $regex: new RegExp(firstName, "i") } },
              { "personalDetails.lastName": { $regex: new RegExp(lastName, "i") } }
            ]
          });
        }
      }

      if (guide) {
        // Update student with guideId and assignment status
        const updateData = {
          "programDetails.guideId": guide._id,
          "programDetails.guideAssignmentStatus": "Assigned",
          "programDetails.guideAssignmentDate": new Date()
        };

        // Keep existing guide name and email if they exist
        if (!student.programDetails.guideName && guide.personalDetails) {
          updateData["programDetails.guideName"] =
            `${guide.personalDetails.firstName || ""} ${guide.personalDetails.lastName || ""}`.trim();
        }

        if (!student.programDetails.guideEmail) {
          updateData["programDetails.guideEmail"] = guide.email;
        }

        await usersCollection.updateOne(
          { _id: student._id },
          { $set: updateData }
        );

        console.log(
          `✅ Updated student ${student.email || student._id}: assigned to guide ${guide.email}`,
        );
        updatedCount++;
      } else {
        console.log(
          `⚠️  Could not find guide for student ${student.email || student._id} (guide: ${guideEmail || guideName})`,
        );
        notFoundCount++;

        // Set assignment status to unassigned for students whose guides weren't found
        await usersCollection.updateOne(
          { _id: student._id },
          {
            $set: {
              "programDetails.guideAssignmentStatus": "Unassigned",
              "programDetails.guideAssignmentDate": new Date()
            }
          }
        );
      }
    }

    // Update students who don't have any guide assignment status
    const studentsWithoutStatus = await usersCollection.updateMany(
      {
        roles: "Student",
        "programDetails.guideAssignmentStatus": { $exists: false }
      },
      {
        $set: {
          "programDetails.guideAssignmentStatus": "Unassigned",
          "programDetails.guideAssignmentDate": new Date()
        }
      }
    );

    // Verify the migration
    const totalStudents = await usersCollection.countDocuments({ roles: "Student" });
    const assignedStudents = await usersCollection.countDocuments({
      roles: "Student",
      "programDetails.guideId": { $exists: true, $ne: null }
    });
    const unassignedStudents = totalStudents - assignedStudents;

    console.log(`\nGuide assignment migration completed!`);
    console.log(`Total students: ${totalStudents}`);
    console.log(`Successfully assigned: ${updatedCount}`);
    console.log(`Guides not found: ${notFoundCount}`);
    console.log(`Students without status updated: ${studentsWithoutStatus.modifiedCount}`);
    console.log(`Final assignment status:`);
    console.log(`  - Assigned students: ${assignedStudents}`);
    console.log(`  - Unassigned students: ${unassignedStudents}`);
    console.log(`  - Assignment percentage: ${totalStudents > 0 ? (assignedStudents / totalStudents * 100).toFixed(2) : 0}%`);

    if (updatedCount > 0) {
      console.log("✅ Guide assignment migration successful");
    } else {
      console.log("ℹ️  No guide assignments were migrated");
    }

  } catch (error) {
    console.error("Guide assignment migration failed:", error);
  }
};

// Run the migration if this file is executed directly
if (require.main === module) {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PhDPortal";

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected! Starting guide assignment migration...");
    return migrateGuideAssignments();
  })
  .then(() => {
    console.log("Guide assignment migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Guide assignment migration script failed:", error);
    process.exit(1);
  })
  .finally(() => {
    mongoose.disconnect();
  });
}

module.exports = migrateGuideAssignments;
