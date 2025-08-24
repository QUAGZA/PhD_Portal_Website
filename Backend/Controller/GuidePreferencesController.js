const User = require("../Model/User");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const fsExtra = require("fs-extra");

// Ensure the preferences directory exists
const preferencesDir = path.resolve(__dirname, "../uploads/preferences");
fsExtra.ensureDirSync(preferencesDir);
console.log("Preferences directory path:", preferencesDir);

exports.submitGuidePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    // Get current user from req.user (set by authentication middleware)
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("Authenticated user:", req.user);
    // Handle both Mongoose ObjectId and string ID formats
    const userId = req.user._id || req.user.id;

    // Get user details from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate the PDF
    // Use a default Aadhaar number for testing if not available
    const aadhar =
      user.personalDetails?.aadhar ||
      user.email?.replace(/[^a-zA-Z0-9]/g, "") ||
      "123456789012";
    console.log("Using Aadhaar for filename:", aadhar);
    const fileName = `${aadhar}_guide_preferences.pdf`;
    const filePath = path.resolve(preferencesDir, fileName);

    // Create PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // PDF content
    doc.fontSize(20).text("PhD Guide Preferences", { align: "center" });
    doc.moveDown();

    // Student information
    doc.fontSize(14).text("Student Details:");
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(
        `Name: ${user.personalDetails?.firstName || ""} ${user.personalDetails?.middleName || ""} ${user.personalDetails?.lastName || ""}`,
      );
    doc
      .fontSize(12)
      .text(
        `Email: ${user.email || user.personalDetails?.contacts?.primaryEmail || ""}`,
      );
    doc.fontSize(12).text(`Aadhaar: ${aadhar}`);
    doc
      .fontSize(12)
      .text(`Mobile: ${user.personalDetails?.contacts?.mobile || ""}`);
    if (user.programDetails) {
      doc
        .fontSize(12)
        .text(`Department: ${user.programDetails.department || ""}`);
      doc
        .fontSize(12)
        .text(`Roll Number: ${user.programDetails.rollNumber || ""}`);
    }
    doc.moveDown(2);

    // Preferences Table
    doc.fontSize(14).text("Guide Preferences:", { underline: true });
    doc.moveDown();

    // Table header
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidth = 150;
    const rowHeight = 30;

    // Draw headers
    doc.fontSize(12).text("Preference", tableLeft, tableTop);
    doc.text("Guide Name", tableLeft + colWidth, tableTop);
    doc.text("Research Interest", tableLeft + colWidth * 2, tableTop);
    doc.moveDown();

    // Draw rows
    let yPosition = tableTop + rowHeight;

    // First preference
    doc.text("First Choice", tableLeft, yPosition);
    doc.text(
      preferences.preference1.guideName || "-",
      tableLeft + colWidth,
      yPosition,
    );
    doc.text(
      preferences.preference1.researchArea || "-",
      tableLeft + colWidth * 2,
      yPosition,
    );

    // Second preference
    yPosition += rowHeight;
    doc.text("Second Choice", tableLeft, yPosition);
    doc.text(
      preferences.preference2.guideName || "-",
      tableLeft + colWidth,
      yPosition,
    );
    doc.text(
      preferences.preference2.researchArea || "-",
      tableLeft + colWidth * 2,
      yPosition,
    );

    // Third preference
    yPosition += rowHeight;
    doc.text("Third Choice", tableLeft, yPosition);
    doc.text(
      preferences.preference3.guideName || "-",
      tableLeft + colWidth,
      yPosition,
    );
    doc.text(
      preferences.preference3.researchArea || "-",
      tableLeft + colWidth * 2,
      yPosition,
    );

    // Submission date
    doc.moveDown(3);
    doc
      .fontSize(10)
      .text(
        `Submitted on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      );

    // End the document
    doc.end();

    // Wait for the PDF to finish writing
    stream.on("finish", async () => {
      console.log(`PDF generated successfully at: ${filePath}`);
      // Update user model with preferences if needed
      // This could be implemented if you want to store preferences in the user model

      return res.status(200).json({
        message: "Guide preferences submitted successfully",
        pdfPath: `/preferences/${fileName}`, // Return the relative path
        fileName: fileName,
      });
    });

    stream.on("error", (error) => {
      console.error("Error generating PDF:", error);
      return res
        .status(500)
        .json({ message: "Error generating PDF", error: error.message });
    });
  } catch (error) {
    console.error("Error submitting guide preferences:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getGuidePreferencesPdf = async (req, res) => {
  try {
    // Get current user from req.user (set by authentication middleware)
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Handle both Mongoose ObjectId and string ID formats
    const userId = req.user._id || req.user.id;

    // Get user details from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const aadhar =
      user.personalDetails?.aadhar ||
      user.email?.replace(/[^a-zA-Z0-9]/g, "") ||
      "unknown";
    const fileName = `${aadhar}_guide_preferences.pdf`;
    const filePath = path.resolve(preferencesDir, fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      console.log("Sending PDF file:", filePath);
      return res.download(filePath, fileName);
    } else {
      console.log("PDF file not found:", filePath);
      return res.status(404).json({
        message: "PDF not found. Please submit your preferences first.",
      });
    }
  } catch (error) {
    console.error("Error retrieving PDF:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
