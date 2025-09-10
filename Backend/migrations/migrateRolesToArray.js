const mongoose = require("mongoose");
require("dotenv").config();

const migrateRolesToArray = async () => {
  try {
    console.log("Starting role migration...");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Find all users that have the old 'role' field (string)
    const usersWithOldRole = await usersCollection
      .find({
        role: { $exists: true, $type: "string" },
      })
      .toArray();

    console.log(
      `Found ${usersWithOldRole.length} users with old role structure`,
    );

    if (usersWithOldRole.length === 0) {
      console.log("No users need migration");
      return;
    }

    // Update each user
    for (const user of usersWithOldRole) {
      const oldRole = user.role;

      // Convert single role to array
      const newRoles = [oldRole];

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { roles: newRoles },
          $unset: { role: "" },
        },
      );

      console.log(
        `Updated user ${user.email || user._id}: "${oldRole}" -> [${newRoles.join(", ")}]`,
      );
    }

    // Verify the migration
    const remainingOldRoles = await usersCollection.countDocuments({
      role: { $exists: true, $type: "string" },
    });

    const newRolesCount = await usersCollection.countDocuments({
      roles: { $exists: true, $type: "array" },
    });

    console.log(`\nMigration completed!`);
    console.log(`Users with old role field: ${remainingOldRoles}`);
    console.log(`Users with new roles array: ${newRolesCount}`);

    if (remainingOldRoles === 0) {
      console.log("✅ All users successfully migrated to new roles structure");
    } else {
      console.log("⚠️  Some users still have the old role structure");
    }
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateRolesToArray()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

module.exports = migrateRolesToArray;
