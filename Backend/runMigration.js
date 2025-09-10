// Standalone script to run the role migration without starting the server
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const migrateRolesToArray = require('./migrations/migrateRolesToArray');

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment or use default
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PhDPortal";

async function runMigration() {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB Connected! Starting migration...");

    // Run migration
    await migrateRolesToArray();

    console.log("Migration process finished successfully!");
  } catch (error) {
    console.error("Migration script failed:", error);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
    process.exit(0);
  }
}

// Run the migration
runMigration();
