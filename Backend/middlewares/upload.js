const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory structure
const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, "../uploads");
  const documentsDir = path.join(uploadsDir, "documents");
  const assignmentsDir = path.join(uploadsDir, "assignments");

  [uploadsDir, documentsDir, assignmentsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadsDir();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.baseUrl.includes("assignment")
      ? "assignments"
      : "documents";

    let userIdentifier;

    // For assignments, use user ID from authenticated user
    if (uploadType === "assignments") {
      userIdentifier = req.user._id.toString();
    } else {
      // For documents during registration, use aadhar
      const aadhar = req.body.aadhar;
      if (!aadhar) {
        console.error("Aadhar number missing in request");
        return cb(
          new Error("Aadhar number is required for document upload"),
          null,
        );
      }
      userIdentifier = aadhar;
    }

    // Create user-specific folder
    const userDir = path.join(
      __dirname,
      "../uploads",
      uploadType,
      userIdentifier,
    );

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const documentType = file.fieldname;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);

    // Simple format: documentType_timestamp.ext (no need for rollNumber in filename since it's in folder)
    const filename = `${documentType}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const uploadType = req.baseUrl.includes("assignment")
    ? "assignments"
    : "documents";

  let allowedTypes;

  if (uploadType === "assignments") {
    // More lenient file types for assignments
    allowedTypes = [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".zip",
      ".rar",
      ".jpg",
      ".jpeg",
      ".png",
    ];
  } else {
    // Strict file types for documents
    allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
  }

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    const allowedTypesStr = allowedTypes.join(", ").toUpperCase();
    cb(
      new Error(
        `Invalid file type. Only ${allowedTypesStr} files are allowed.`,
      ),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file for assignments, 5MB for documents
  },
  fileFilter: fileFilter,
});

// Export upload configurations
module.exports = {
  // For registration - upload multiple different document types
  uploadRegistrationDocuments: upload.fields([
    { name: "undergradMarksheet", maxCount: 1 },
    { name: "postgradMarksheet", maxCount: 1 },
    { name: "undergradCertificate", maxCount: 1 },
    { name: "postgradCertificate", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "eligibilityCertificate", maxCount: 1 },
    { name: "migrationCertificate", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
    { name: "bonafideCertificate", maxCount: 1 },
    { name: "nocCertificate", maxCount: 1 },
  ]),

  // For assignments - simple multiple files
  uploadAssignments: upload.array("assignments", 5),

  createUploadsDir,
};
