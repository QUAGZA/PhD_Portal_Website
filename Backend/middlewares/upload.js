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
    const rollNumber =
      req.user.profile?.enrollmentId ||
      req.body.rollNumber ||
      req.user._id.toString();

    // Create user-specific folder using rollNumber
    const userDir = path.join(__dirname, "../uploads", uploadType, rollNumber);

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
  const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG allowed.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
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
