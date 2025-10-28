const mongoose = require("mongoose");
require("dotenv").config();

const fixGuideReferences = async () => {
  try {
    console.log("Starting guide reference fix migration...");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Find all users that have the old 'programDetails.guide' field
    const usersWithOldGuideField = await usersCollection
      .find({
        "programDetails.guide": { $exists: true },
      })
      .toArray();

    console.log(
      `Found ${usersWithOldGuideField.length} users with old programDetails.guide field`,
    );

    if (usersWithOldGuideField.length === 0) {
      console.log("No users need guide reference migration");
      return;
    }

    let updatedCount = 0;
    let errorCount = 0;

    // Process each user
    for (const user of usersWithOldGuideField) {
      try {
        const oldGuideRef = user.programDetails?.guide;

        if (!oldGuideRef) {
          continue;
        }

        // Check if the old guide reference is a valid ObjectId
        let guideId = null;
        if (mongoose.Types.ObjectId.isValid(oldGuideRef)) {
          guideId = oldGuideRef;
        } else if (typeof oldGuideRef === "string") {
          // Try to find guide by email or name
          const guide = await usersCollection.findOne({
            $or: [
              { email: oldGuideRef },
              { "personalDetails.firstName": { $regex: oldGuideRef, $options: "i" } },
            ],
            roles: "Guide",
          });

          if (guide) {
            guideId = guide._id;
          }
        }

        // Update the user document
        const updateData = {
          $unset: { "programDetails.guide": "" },
        };

        if (guideId) {
          updateData.$set = {
            "programDetails.guideId": guideId,
            "programDetails.guideAssignmentStatus": "Assigned",
            "programDetails.guideAssignmentDate": new Date(),
          };

          // Get guide details for name and email
          const guide = await usersCollection.findOne({ _id: guideId });
          if (guide) {
            updateData.$set["programDetails.guideName"] =
              `${guide.personalDetails?.firstName || ""} ${guide.personalDetails?.lastName || ""}`.trim();
            updateData.$set["programDetails.guideEmail"] = guide.email;
          }
        } else {
          updateData.$set = {
            "programDetails.guideAssignmentStatus": "Unassigned",
            "programDetails.guideAssignmentDate": new Date(),
          };
        }

        await usersCollection.updateOne({ _id: user._id }, updateData);

        console.log(
          `✅ Updated user ${user.email || user._id}: ${oldGuideRef} -> ${guideId || "unassigned"}`,
        );
        updatedCount++;
      } catch (error) {
        console.error(
          `❌ Error updating user ${user.email || user._id}:`,
          error.message,
        );
        errorCount++;
      }
    }

    // Verify the migration
    const remainingOldRefs = await usersCollection.countDocuments({
      "programDetails.guide": { $exists: true },
    });

    const newGuideIds = await usersCollection.countDocuments({
      "programDetails.guideId": { $exists: true, $ne: null },
    });

    console.log(`\nGuide reference fix migration completed!`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log(`Remaining old references: ${remainingOldRefs}`);
    console.log(`Users with guideId field: ${newGuideIds}`);

    if (remainingOldRefs === 0) {
      console.log("✅ All old guide references have been migrated");
    } else {
      console.log("⚠️  Some old guide references still exist");
    }

    // Additional cleanup: Remove any assignments or submissions referencing old schema
    console.log("\n🧹 Cleaning up related collections...");

    // Note: Add cleanup for Assignment and Submission collections if needed
    // This would depend on your specific schema structure

  } catch (error) {
    console.error("Guide reference fix migration failed:", error);
  }
};

// Run the migration if this file is executed directly
if (require.main === module) {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PhDPortal";

  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connected! Starting guide reference fix migration...");
      return fixGuideReferences();
    })
    .then(() => {
      console.log("Guide reference fix migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Guide reference fix migration script failed:", error);
      process.exit(1);
    })
    .finally(() => {
      mongoose.disconnect();
    });
}

module.exports = fixGuideReferences;
